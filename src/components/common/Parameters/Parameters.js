import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import moment from 'moment';
import Multiselect from 'react-select';
import Datetime from 'react-datetime';
import s from './Parameters.scss';

class Parameters extends Component {

  // UTILS

  getRelativeDataOptions = () => {
    const {
      strParamRelativeDateBeginning, strParamRelativeDateCurrent, strParamRelativeDateEnd, strParamRelativeDateMonth,
      strParamRelativeDatePrevious, strParamRelativeDateNext, strParamRelativeDateDay, strParamRelativeDateWeek,
      strParamRelativeDateQuarter, strParamRelativeDateYear,
    } = this.props;
    return {
      start: [
        { value: 'beginning', label: strParamRelativeDateBeginning },
        { value: 'end', label: strParamRelativeDateEnd },
      ],
      shift: [
        { value: 'current', label: strParamRelativeDateCurrent },
        { value: 'previous', label: strParamRelativeDatePrevious },
        { value: 'next', label: strParamRelativeDateNext },
      ],
      range: [
        { value: 'day', label: strParamRelativeDateDay },
        { value: 'week', label: strParamRelativeDateWeek },
        { value: 'month', label: strParamRelativeDateMonth },
        { value: 'quarter', label: strParamRelativeDateQuarter },
        { value: 'year', label: strParamRelativeDateYear },
      ],
    };
  };

  formatDateTime = (dt) =>
    moment(dt).format('MM/DD/YYYY HH:MM:SS');

  hasDependencies = (parameters) => !!parameters.filter(param =>
    param.parameterState.hasOutstandingDependencies).length;

  parseRelativeDate = (value) => {
    const isNullOrEmpty = (str) => !str || str.length === 0;

    if (isNullOrEmpty(value)) return false;

    const rdOptions = this.getRelativeDataOptions();

    const getShiftValue = (val) => {
      switch (val) {
        case '-': return rdOptions.shift[1].value;
        case '+': return rdOptions.shift[2].value;
        case undefined: return rdOptions.shift[0].value;
        default: return null;
      }
    };

    const getRangeValue = (val) => {
      switch (val) {
        case 'd': return rdOptions.range[0].value;
        case 'w': return rdOptions.range[1].value;
        case 'm': return rdOptions.range[2].value;
        case 'q': return rdOptions.range[3].value;
        case 'y': return rdOptions.range[4].value;
        default: return null;
      }
    };

    const pattern = /^@([-+]?)?([dwmqy]){1}(_[be])?$/i;

    const match = pattern.exec(value);
    if (isNullOrEmpty(match)) return false;

    const shift = getShiftValue(match[1]);
    if (isNullOrEmpty(shift)) return false;

    const range = getRangeValue(match[2]);
    if (isNullOrEmpty(range)) return false;

    const end = match[3] === '_e';
    const start = rdOptions.start[end ? 1 : 0].value;

    return ({ start, shift, range });
  };


  // ACTIONS HANDLERS

  handleChangeParams = (params) => this.props.onChangeParams(params);
  handleUpdateParams = () => this.props.onUpdateParams();


  // EVENTS HANDLERS

  handleDependencies = (key) => {
    const data = this.props.data.slice();
    if (this.hasDependencies(data) || data[key].dependentParameters) {
      this.handleUpdateParams();
    }
  };

  handleOnChangeDateControl = (isRelativeDate, id) => {
    const { domainTypes } = this.props;
    const data = this.props.data.slice();
    const param = data[id];

    if (isRelativeDate) {
      // regular datetime
      param.domain = domainTypes.specifiedValues;
      param.values = [{ value: this.formatDateTime(Date.now()).toString() }];
    } else {
      // relative date
      param.domain = domainTypes.acceptingDynamicValues;
      param.values = [{ value: '@d' }]; // Beginning (of) current day
    }

    this.handleChangeParams(data);
  };

  /**
   * @param {Object[]} values
   * @param {string} values[].value
   * @param {string} [values[].label]
   * @param {number} id - Parameter ID
   */
  handleOnChangeMulti = (values, id) => {
    const { domainTypes } = this.props;
    const data = this.props.data.slice();
    const param = data[id];
    const isSelectAll = values[0].value === 'SelectAll';
    param.domain = isSelectAll ? domainTypes.selectAll : domainTypes.specifiedValues; // update domain
    param.values = values.map(v => ({ value: v.value }));
    this.handleChangeParams(data);
  };

  /**
   * @param {string} value
   * @param {number} id - Parameter ID
   * @param {number} [domain=null] - Domain ID
   */
  handleOnChangeSingle = (value, id, domain) => {
    const data = this.props.data.slice();
    const param = data[id];
    param.domain = domain || 0; // update domain
    param.values = [!!value ? { value } : ''];
    this.handleChangeParams(data);
  };

  /**
   * @param {Object} rdValues
   * @param {string} rdValues.start
   * @param {string} rdValues.shift
   * @param {string} rdValues.range
   * @param {number} id - Parameter ID
   */
  evaluteRelativeDate = (rdValues, id) => {
    let result = '@';
    const { domainTypes } = this.props;
    const { start, shift, range } = rdValues;
    const rangeId = range.substr(0, 1);

    switch (shift) {
      case 'current': result += rangeId; break;
      case 'previous': result += `-${rangeId}`; break;
      case 'next': result += `+${rangeId}`; break;
      default: result = '';
    }

    if (start === 'end') result += '_e';
    this.handleOnChangeSingle(result, id, domainTypes.acceptingDynamicValues);
  };


  // RENDER ASSETS

  renderDatetimeControl = (item, key) => {
    const { canSetRelativeDate, domainTypes } = this.props;
    const rdValues = { start: null, shift: null, range: null };
    const rdOptions = this.getRelativeDataOptions();
    const isRelativeDate = this.parseRelativeDate(item.values[0].value);
    const parseDateString = (str) => typeof str === 'string' ? Date.parse(str) : '';

    if (isRelativeDate) Object.assign(rdValues, isRelativeDate);

    return (
      <div>
        { canSetRelativeDate && (
            <div className={s.check}>
              <label>
                <input
                  type="checkbox" checked={isRelativeDate}
                  onChange={() => this.handleOnChangeDateControl(isRelativeDate, key)}
                />
                Relative Data
              </label>
            </div>
          )
        }

        { /* RelativeDate */
          isRelativeDate && (
            <div>
              <div className={s.third}>
                <div className={s.inputGroup}>
                  <select
                    className={s.inputGroup_control}
                    value={rdValues.start}
                    onChange={(event) => this.evaluteRelativeDate(Object.assign({}, rdValues, { start: event.target.value }), key)}
                  >
                    { rdOptions.start.map((opt, idx) => (
                      <option key={`${opt.value}_${idx}`} value={opt.value}>
                        { opt.label }
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={s.third}>
                <div className={s.inputGroup}>
                  <span className={s.inputGroup_addon}>of</span>
                  <select
                    className={s.inputGroup_control}
                    value={rdValues.shift}
                    onChange={(event) => this.evaluteRelativeDate(Object.assign({}, rdValues, { shift: event.target.value }), key)}
                  >
                    { rdOptions.shift.map((opt, idx) => (
                      <option key={`${opt.value}_${idx}`} value={opt.value}>
                        { opt.label }
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={s.third}>
                <div className={s.inputGroup}>
                  <select
                    className={s.inputGroup_control}
                    value={rdValues.range}
                    onChange={(event) => this.evaluteRelativeDate(Object.assign({}, rdValues, { range: event.target.value }), key)}
                  >
                    { rdOptions.range.map((opt, idx) => (
                      <option key={`${opt.value}_${idx}`} value={opt.value}>
                        { opt.label }
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )
        }
        { /* DateTime */
          !isRelativeDate && (
            <Datetime
              className={s.datetime}
              timeFormat={!item.dateOnly}
              value={item.dateOnly
                ? moment(parseDateString(item.values[0].value)).format('L') // 11/29/2016
                : moment(parseDateString(item.values[0].value)).format('LLL') // November 29, 2016 2:46 PM
              }
              onChange={(value) => this.handleOnChangeSingle(this.formatDateTime(value), key, domainTypes.specifiedValues)}
              onBlur={() => this.handleDependencies(key)}
            />
          )
        }
    </div>
    );
  };

  // Render assets
  renderFormControl = (item, key) => {
    const { classFormGroup, classControlLabel, strParamOutstandingDepText, strParamValueExpectedText } = this.props;
    const { domainTypes } = this.props;

    return (
      <div
        key={item.name}
        className={cx(classFormGroup, s.group, {
          [s.group_hidden]: item.hidden,
          [s.group_success]: item.parameterState.ok,
          [s.group_error]: !item.parameterState.ok,
        })}
      >
        <label className={ cx(s.label, classControlLabel) }>
          { item.prompt }
        </label>

        { /* SingleValue DateTime */
          item.controlOptions.singleValue && item.controlType.datetime && this.renderDatetimeControl(item, key)
        }

        { /* SingleValue Text */
          item.controlOptions.singleValue && item.controlType.text && (
            <input
              className={s.input}
              value={item.values[0].value}
              type="text"
              onChange={(e) => this.handleOnChangeSingle(e.target.value, key, domainTypes.specifiedValues)}
            />
          )
        }

        { /* SelectOneFromMany */
          item.controlOptions.selectOneFromMany && (
            <Multiselect
              backspaceRemoves={false}
              className={s.multiselect}
              disabled={!item.availableValues.length}
              multi={false}
              openAfterFocus
              options={item.availableValues}
              value={item.values[0].value}
              simpleValue
              onBlur={() => this.handleDependencies(key)}
              onChange={(value) => this.handleOnChangeSingle(value, key, domainTypes.specifiedValues)}
              onClose={() => this.handleDependencies(key)}
            />
          )
        }

        { /* MultiValue */
          item.controlOptions.multiValue && (
            <Multiselect
              className={s.multiselect}
              disabled={!item.availableValues.length}
              multi={item.multiValue}
              openAfterFocus
              backspaceRemoves={false}
              options={item.availableValues}
              value={
                item.domain === domainTypes.selectAll
                  ? item.availableValues.map(v => v.value) // select all
                  : item.values.map(v => v.value)
              }
              onBlur={() => this.handleDependencies(key)}
              onChange={data => this.handleOnChangeMulti(data, key)}
              onClose={() => this.handleDependencies(key)}
            />
          )
        }

        { /* MultiLine */
          item.controlOptions.multiLine && (
            <textarea
              rows="5"
              className={s.textarea}
              value={item.values[0].value}
              onChange={(e) => this.handleOnChangeSingle(e.target.value, key, domainTypes.specifiedValues)}
            />
          )
        }

        <div className={s.help}>
          { item.parameterState.expectValue && <span>{ strParamValueExpectedText }</span> }
          { item.parameterState.hasOutstandingDependencies && <span>{ strParamOutstandingDepText }</span> }
        </div>
      </div>
    );
  };

  // Render component
  render() {
    const { classComponent, data, hasData, hasVisibleData, strParamEmptyText, strParamHiddenText } = this.props;
    return hasData ? (
      <div className={classComponent}>
        { data.map((param, key) => this.renderFormControl(param, key)) }
        { !hasVisibleData && strParamHiddenText }
      </div>
    ) : (
      <div className={classComponent}>
        { strParamEmptyText }
      </div>
    );
  }
}

Parameters.propTypes = {
  // Data
  canSetRelativeDate: PropTypes.bool,
  classComponent: PropTypes.string,
  classControlLabel: PropTypes.string,
  classFormGroup: PropTypes.string,
  data: PropTypes.array,
  domainTypes: PropTypes.object,
  hasData: PropTypes.bool,
  hasVisibleData: PropTypes.bool,
  // Strings
  strParamEmptyText: PropTypes.string,
  strParamHiddenText: PropTypes.string,
  strParamOutstandingDepText: PropTypes.string,
  strParamValueExpectedText: PropTypes.string,
  strParamRelativeDateBeginning: PropTypes.string,
  strParamRelativeDateEnd: PropTypes.string,
  strParamRelativeDateCurrent: PropTypes.string,
  strParamRelativeDatePrevious: PropTypes.string,
  strParamRelativeDateNext: PropTypes.string,
  strParamRelativeDateDay: PropTypes.string,
  strParamRelativeDateWeek: PropTypes.string,
  strParamRelativeDateMonth: PropTypes.string,
  strParamRelativeDateQuarter: PropTypes.string,
  strParamRelativeDateYear: PropTypes.string,
  // Actions
  onChangeParams: PropTypes.func,
  onSubmitParams: PropTypes.func,
  onUpdateParams: PropTypes.func,
};

Parameters.defaultProps = {
  canSetRelativeDate: false,
  domainTypes: {
    specifiedValues: 0,
    selectAll: 1,
    acceptingDynamicValues: 2,
  },
};

export default Parameters;
