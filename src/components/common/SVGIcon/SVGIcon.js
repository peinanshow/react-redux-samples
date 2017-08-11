import React, {PropTypes} from "react";
import s from "./SVGIcon.scss";
import cx from "classnames";
const SVGIcon = (props) => {
  const itemClass = cx({
    [s.tool]: !props.disabled,
    [s.tool_disabled]: props.disabled,
  });
  const lineClass = cx({
    [s.line]: !props.disabled,
    [s.line_disabled]: props.disabled,
  });

  return (
    <div className={s.root}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px">
        <rect x="1" y="1" rx="2" ry="2" width="12" height="14" className={itemClass}/>
        <rect width="100%" height="4" x="0" y="6" strokeWidth="0" fill="#fff"/>
        <line stroke="#000000" strokeDasharray="2,2" y2="8" x2="16" y1="8" x1="0" strokeWidth="1" fill="none" className={lineClass}/>
        <line stroke="#fff" y2="4" x2="10" y1="4" x1="4" strokeWidth="1" fill="none"/>
        <line stroke="#fff" y2="12" x2="10" y1="12" x1="4" strokeWidth="1" fill="none"/>
      </svg>
    </div>
  );
};
SVGIcon.propTypes = {
  disabled: PropTypes.bool,
};

SVGIcon.defaultProps = {
  disabled: false,
};
export default SVGIcon;
