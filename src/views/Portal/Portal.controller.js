import React, {PropTypes, Component} from "react";
import cx from "classnames";
import {bindActionCreators} from "redux";
import {settings, endpoints} from "../../config";
import {openWindow} from "../../utils/index";
import createDataProviders from "../../utils/createDataProviders";
import connect from "../../utils/connect";
import messages from "./Portal.messages";
import ToolTypes from "../../constants/ToolTypes";
import * as authActionCreators from "../../actions/AuthActionCreators";
import * as documentsActionsCreators from "../../actions/DocumentsActionCreators";
import * as parametersActionCreators from "../../actions/ParametersActionCreators";
import * as permissionActionsCreators from "../../actions/PermissionActionsCreators";
import * as scheduleActionsCreators from "../../actions/ScheduleActionsCreators";
import * as tagsActionsCreators from "../../actions/TagsActionsCreators";
import * as uiActionCreators from "../../actions/UIActionCreators";
import * as userActionCreators from "../../actions/UserActionCreators";
import * as portalActionCreators from "../../actions/PortalActionCreators";
import AssignTo from "../../components/common/AssignTo";
import Confirm from "../../components/common/Confirm";
import ContextMenu from "../../components/common/ContextMenu";
import Menu from "../../components/common/DropdownItem";
import MoveTo from "../../components/common/MoveTo";
import Omni from "../../components/common/Dropdown";
import Prompt from "../../components/common/Prompt";
import Tool from "../../components/common/Button";
import NewReport from "../../components/portal/NewReport";
import Permissions from "../../components/portal/Permissions";
import PropertiesDock from "../../components/portal/PropertiesDock";
import ReportsDock from "../../components/portal/ReportsDock";
import ReportsFilter from "../../components/portal/ReportsFilter";
import BusyIndicator from '../../components/common/BusyIndicator';
// Import Action Creators

// Common Components

// Portal Components


class PortalViewController extends Component {

  state = {docContextMenu: null};

  componentDidMount() {
    //this.props.portalActions.initPortal();
  }

  // UTILS

  isCurrentToolType = (toolType) =>
  this.props.ui.currentToolType === toolType;

  openDesigner = (model) => {
    const path = this.context.router.createPath({
      pathname: '/',
      query: {
        handler: 'designer',
        modelName: model,
        reportAction: 'Create',
      },
    });
    openWindow(path);
  };

  modifyReport = () => {
    const {auth, document} = this.props;
    if (document.type === 'PageReport' || document.type === 'SectionReport') {
      openWindow(`${endpoints.arsBaseLocation()}/Designer.Win/ActiveReports.Server.Designer.Win.application?action=design
        &authtoken= + ${encodeURIComponent(auth.token)}
        &endpoint= + ${encodeURIComponent(endpoints.arsRest())}
        &reportid= + ${encodeURIComponent(document._id)}`);
    } else {
      openWindow(this.context.router.createPath({
        pathname: '/',
        query: {
          handler: 'designer',
          reportId: document._id,
          reportAction: 'Design',
        },
      }));
    }
  };

  openViewer = (action, fileType, document = null) => {
    const report = document || this.props.document;
    const path = this.context.router.createPath({
      pathname: '/',
      query: {
        handler: 'viewer',
        action: action || null,
        id: report._id,
        name: report.name,
        type: fileType || null,
      },
    });
    openWindow(path);
  };

  components = {
    [BusyIndicator]: () => {
      const { ui } = this.props;
      return ui.isBusy ? {} : null;
    },

    [Tool]: (instance) => {
      const {authActions, documents, caps, intl, operations, style, user, ui, uiActions} = this.props;
      const tools = {
        [ToolTypes.DESIGN_DOC]: {
          hidden: !documents.id,
          icon: 'cube',
          disabled: !user.hasDesignerAddon,
          label: intl.formatMessage(messages.toolDesignLabel),
          title: intl.formatMessage(messages.toolDesignTitle),
          onClick: () => this.modifyReport(),
        },
        [ToolTypes.SCHEDULE_DOC]: {
          hidden: !documents.id,
          icon: 'calendar-check-o',
          disabled: !caps.createReportSchedule,
          label: intl.formatMessage(messages.toolScheduleLabel),
          title: intl.formatMessage(messages.toolScheduleTitle),
          onClick: uiActions.showSchedules,
        },
        [ToolTypes.TOGGLE_PROPERTIES_PANE]: {
          icon: 'info-circle',
          active: ui.propertiesVisibility,
          title: intl.formatMessage(messages.toolTogglePropsTitle),
          onClick: uiActions.toggleProperties,
        },
        [ToolTypes.LOG_OUT]: {
          icon: 'user',
          caret: 'caret-down',
          label: `${user.name.charAt(0).toUpperCase() + user.name.substr(1).toLowerCase()}`,
          title: intl.formatMessage(messages.toolLogoutTitle),
          onClick: authActions.logOut,
        },
      };
      return Object.assign({}, tools[instance.props.id] || instance.props, {style});
    },

    [Omni]: (instance) => {
      const {documents, intl, style, tag, tags,user, uiSettings} = this.props;
      const isCategorized = tag.id !== '0';
      const isDisabled = !isCategorized || tag.isFavorites || documents.isProcessing;
      const hasDataToSort = documents.list.length > 1;
      const tagName = cx({
        [tags.tagName]: tags.tagName !== 'Favorites' && tags.tagName !== 'Uncategorized',
        [intl.formatMessage(messages.tagsFavorites)]: tags.tagName === 'Favorites',
        [intl.formatMessage(messages.tagsUncategorized)]: tags.tagName === 'Uncategorized',
      });
      const tools = {
        [ToolTypes.TOGGLE_ACTION_MENU]: {
          icon: 'plus',
          label: intl.formatMessage(messages.omniActionMenuLabel),
          title: intl.formatMessage(messages.omniActionMenuTitle),
        },
        [ToolTypes.TOGGLE_TAG_MENU]: {
          caret: isDisabled ? '' : 'sort',
          icon: cx({
            ['refresh']: documents.isProcessing,
            ['star-o']: tag.isFavorites,
            ['folder-o']: !tag.isFavorites,
          }),
          disabled: isDisabled,
          processing: documents.isProcessing,
          label: tagName,
          title: tagName,
        },
        [ToolTypes.TOGGLE_DOC_MENU]: {
          hidden: !documents.id,
          caret: 'caret-square-o-down',
          menuRight: true,
          label: intl.formatMessage(messages.omniMoreMenuLabel),
          title: intl.formatMessage(messages.omniMoreMenuTitle),
        },
        [ToolTypes.TOGGLE_SORT_MENU]: {
          caret: hasDataToSort ? 'sort' : '',
          hidden: !hasDataToSort,
          menuRight: true,
          label: intl.formatMessage(messages.omniSortMenuLabel),
          title: intl.formatMessage(messages.omniSortMenuTitle),
        },
        [ToolTypes.USER_MANAGE_MENU]: {
          icon: 'user',
          caret: 'caret-down',
          label: `${user.name.charAt(0).toUpperCase() + user.name.substr(1).toLowerCase()}`,
          menuRight: true
        },
      };
      return Object.assign({}, tools[instance.props.id] || instance.props, {style});
    },

    [Menu]: (instance) => {
      const {document, documents, docsActions, caps, operations, intl, style, tag, user, uiActions,authActions} = this.props;
      const tools = {
        [ToolTypes.DESIGN_DOC]: {
          hidden: !documents.id,
          icon: 'cube',
          disabled: !user.hasDesignerAddon,
          label: intl.formatMessage(messages.menuDesignLabel),
          title: intl.formatMessage(messages.menuDesignTitle),
          onClick: () => this.modifyReport(),
        },
        [ToolTypes.SCHEDULE_DOC]: {
          icon: 'calendar-check-o',
          label: intl.formatMessage(messages.menuScheduleLabel),
          title: intl.formatMessage(messages.menuScheduleTitle),
          disabled: !caps.createReportSchedule,
          onClick: uiActions.showSchedules,
        },
        [ToolTypes.CREATE_DOC]: {
          icon: 'file-text',
          label: intl.formatMessage(messages.menuCreateReportLabel),
          title: intl.formatMessage(messages.menuCreateReportTitle),
          disabled: !user.hasDesignerAddon,
          onClick: uiActions.showReportDialog,
        },
        [ToolTypes.CREATE_TAG]: {
          icon: 'folder',
          label: intl.formatMessage(messages.menuCreateTagLabel),
          title: intl.formatMessage(messages.menuCreateTagTitle),
          disabled: !caps.createTags,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.CREATE_TAG),
        },
        [ToolTypes.CREATE_TAG_ROOT]: {
          icon: 'folder',
          label: intl.formatMessage(messages.menuCreateRootTagLabel),
          title: intl.formatMessage(messages.menuCreateRootTagTitle),
          disabled: !caps.createTags,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.CREATE_TAG),
        },
        [ToolTypes.MOVE_TAG]: {
          icon: 'folder',
          label: intl.formatMessage(messages.menuMoveToLabel),
          title: intl.formatMessage(messages.menuMoveToTitle),
          disabled: tag.isSystem,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.MOVE_TAG),
        },
        [ToolTypes.RENAME_TAG]: {
          icon: '',
          label: intl.formatMessage(messages.menuRenameTagLabel),
          title: intl.formatMessage(messages.menuRenameTagTitle),
          disabled: tag.isSystem,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.RENAME_TAG),
        },
        [ToolTypes.DELETE_TAG]: {
          icon: 'trash-o',
          label: intl.formatMessage(messages.menuDeleteTagLabel),
          title: intl.formatMessage(messages.menuDeleteTagTitle),
          disabled: tag.isSystem,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.DELETE_TAG),
        },
        [ToolTypes.REMOVE_FROM_FAVORITES]: {
          icon: 'star-o',
          label: intl.formatMessage(messages.menuRemoveFavoritesLabel),
          title: intl.formatMessage(messages.menuRemoveFavoritesTitle),
          hidden: !document.isFavorited,
          onClick: () => docsActions.removeFromFavorites(documents.id),
        },
        [ToolTypes.ADD_TO_FAVORITES]: {
          icon: 'star',
          label: intl.formatMessage(messages.menuAddFavoritesLabel),
          title: intl.formatMessage(messages.menuAddFavoritesTitle),
          hidden: document.isFavorited,
          onClick: () => docsActions.addToFavorites(documents.id),
        },
        [ToolTypes.ASSIGN_DOC]: {
          icon: 'folder',
          label: intl.formatMessage(messages.menuAssignToLabel),
          title: intl.formatMessage(messages.menuAssignToTitle),
          onClick: () => uiActions.setCurrentToolType(ToolTypes.ASSIGN_DOC),
        },
        [ToolTypes.RENAME_DOC]: {
          icon: '',
          label: intl.formatMessage(messages.menuRenameDocLabel),
          title: intl.formatMessage(messages.menuRenameDocTitle),
          disabled: !operations.canUpdate,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.RENAME_DOC),
        },
        [ToolTypes.PRINT]: {
          icon: 'print',
          label: intl.formatMessage(messages.menuPrintLabel),
          title: intl.formatMessage(messages.menuPrintTitle),
          onClick: () => this.openViewer('print'),
        },
        [ToolTypes.EXPORT_AS_PDF]: {
          icon: 'file-pdf-o',
          label: intl.formatMessage(messages.menuExportAsPdfLabel),
          title: intl.formatMessage(messages.menuExportAsPdfTitle),
          onClick: () => this.openViewer('export', 'PDF'),
        },
        [ToolTypes.EXPORT_AS_DOC]: {
          icon: 'file-word-o',
          label: intl.formatMessage(messages.menuExportAsWordLabel),
          title: intl.formatMessage(messages.menuExportAsWordTitle),
          onClick: () => this.openViewer('export', 'Word'),
        },
        [ToolTypes.EXPORT_AS_IMG]: {
          icon: 'file-image-o',
          label: intl.formatMessage(messages.menuExportAsImageLabel),
          title: intl.formatMessage(messages.menuExportAsImageTitle),
          onClick: () => this.openViewer('export', 'Image'),
        },
        [ToolTypes.EXPORT_AS_WEB]: {
          icon: 'file-zip-o',
          label: intl.formatMessage(messages.menuExportAsWebLabel),
          title: intl.formatMessage(messages.menuExportAsWebTitle),
          onClick: () => this.openViewer('export', 'Html'),
        },
        [ToolTypes.EXPORT_AS_XLS]: {
          icon: 'file-excel-o',
          label: intl.formatMessage(messages.menuExportAsExcelLabel),
          title: intl.formatMessage(messages.menuExportAsExcelTitle),
          onClick: () => this.openViewer('export', 'Excel'),
        },
        [ToolTypes.DELETE_DOC]: {
          icon: 'trash-o',
          label: intl.formatMessage(messages.menuDeleteReportLabel),
          title: intl.formatMessage(messages.menuDeleteReportTitle),
          disabled: !operations.canDelete,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.DELETE_DOC),
        },
        [ToolTypes.SORT_BY_DOCUMENT_NAME]: {
          icon: documents.listSortFlag === ToolTypes.SORT_BY_DOCUMENT_NAME ? 'check' : '',
          label: intl.formatMessage(messages.menuSortByReportNameLabel),
          title: intl.formatMessage(messages.menuSortByReportNameTitle),
          onClick: () => docsActions.setSortFlag(ToolTypes.SORT_BY_DOCUMENT_NAME),
        },
        [ToolTypes.SORT_BY_LAST_MODIFIED]: {
          icon: documents.listSortFlag === ToolTypes.SORT_BY_LAST_MODIFIED ? 'check' : '',
          label: intl.formatMessage(messages.menuSortByLastModifiedLabel),
          title: intl.formatMessage(messages.menuSortByLastModifiedTitle),
          onClick: () => docsActions.setSortFlag(ToolTypes.SORT_BY_LAST_MODIFIED),
        },
        [ToolTypes.SORT_BY_MODIFIED_BY]: {
          icon: documents.listSortFlag === ToolTypes.SORT_BY_MODIFIED_BY ? 'check' : '',
          label: intl.formatMessage(messages.menuSortByModifiedByLabel),
          title: intl.formatMessage(messages.menuSortByModifiedByTitle),
          onClick: () => docsActions.setSortFlag(ToolTypes.SORT_BY_MODIFIED_BY),
        },
        [ToolTypes.REPORT_MANAGE_MENU]: {
          icon: 'table',
          label: intl.formatMessage(messages.menuReportManagementTitle),
          onClick: () => openWindow(endpoints.arsBaseLocation()),
        },
        [ToolTypes.SYSTEM_MANAGE_MENU]: {
          icon: 'cogs',
          label: intl.formatMessage(messages.menuSystemManagementTitle),
          onClick: () => openWindow(`${endpoints.arsBaseLocation()}/admin`),
        },
        [ToolTypes.LOG_OUT]: {
          icon: 'sign-out',
          label: intl.formatMessage(messages.menuLogoutTitle),
          title: intl.formatMessage(messages.menuLogoutTitle),
          onClick: authActions.logOut,
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, {style});
    },

    [NewReport]: () => {
      const {documents, docsActions, intl, ui, uiActions} = this.props;
      return ui.reportDialogVisibility ? {
        // Data
        isProcessing: documents.isProcessingModels,
        models: documents.models,
        strCaption: intl.formatMessage(messages.modalNewReportCaption),
        strHint: intl.formatMessage(messages.modalNewReportHint),
        strConfirmLabel: intl.formatMessage(messages.modalNewReportConfirmLabel),
        strCancelLabel: intl.formatMessage(messages.modalNewReportCancelLabel),
        // Actions
        onDismiss: uiActions.hideReportDialog,
        onMount: docsActions.getModels,
        onSubmit: this.openDesigner,
      } : null;
    },

    [Permissions]: () => {
      const {document, permissions, intl, ui, permissionActions, uiActions} = this.props;
      return ui.permissionsVisibility ? {
        // Data
        data: permissions.data,
        documentId: document._id,
        documentName: document.name,
        isProcessing: permissions.isProcessing,
        strCaption: intl.formatMessage(messages.modalPermissionsCaption),
        strHint: intl.formatMessage(messages.modalPermissionsHint),
        strRoleHead: intl.formatMessage(messages.modalPermissionsRoleHead),
        strPrivilegeHead: intl.formatMessage(messages.modalPermissionsPrivilegeHead),
        strSaveLabel: intl.formatMessage(messages.modalPermissionsSaveLabel),
        // Action
        onDismiss: uiActions.hidePermissions,
        onMount: permissionActions.getPermissions,
        onSubmit: permissionActions.updatePermissions,
      } : null;
    },

    [Schedule]: () => {
      const {document, schedule, parameters, parametersActions, printers, intl, ui, scheduleActions, uiActions} = this.props;
      return ui.schedulesVisibility ? {
        // Data
        data: schedule.data,
        documentId: document._id,
        documentName: document.name,
        documentParameters: parameters.data,
        errors: schedule.errorList,
        hasDocumentParameters: parameters.hasData,
        hasVisibleParameters: parameters.hasVisibleParameters,
        isProcessing: schedule.isProcessing,
        isProcessingParameters: parameters.isProcessing,
        isProcessingTemplate: schedule.isProcessingTemplate,
        isRequestingParameters: parameters.isRequesting,
        isUpdateInProgress: schedule.isUpdateInProgress,
        printers: printers.data,
        templates: schedule.templates,
        // Strings
        strCaption: intl.formatMessage(messages.modalScheduleCaption),
        strHint: intl.formatMessage(messages.modalScheduleHint),
        strAddTask: intl.formatMessage(messages.modalScheduleAddTask),
        strRemoveTask: intl.formatMessage(messages.modalScheduleRemoveTask),
        strNoTaskAssociated: intl.formatMessage(messages.modalScheduleNoTaskAssociated),
        strValidationHint: intl.formatMessage(messages.modalScheduleValidationHint),
        strScheduleSaveLabel: intl.formatMessage(messages.modalScheduleSaveLabel),
        strOptionalLabel: intl.formatMessage(messages.modalScheduleOptionalLabel),
        strFileNameLabel: intl.formatMessage(messages.modalScheduleFileNameLabel),
        strFileExtensionLabel: intl.formatMessage(messages.modalScheduleFileExtensionLabel),
        strFileExtensionTrueOption: intl.formatMessage(messages.modalScheduleFileExtensionTrueOption),
        strFileExtensionFalseOption: intl.formatMessage(messages.modalScheduleFileExtensionFalseOption),
        strPathLabel: intl.formatMessage(messages.modalSchedulePathLabel),
        strUserNameLabel: intl.formatMessage(messages.modalScheduleUserNameLabel),
        strPasswordLabel: intl.formatMessage(messages.modalSchedulePasswordLabel),
        strOverwriteLabel: intl.formatMessage(messages.modalScheduleOverwriteLabel),
        strOverwriteTrueOption: intl.formatMessage(messages.modalScheduleOverwriteTrueOption),
        strOverwriteFalseOption: intl.formatMessage(messages.modalScheduleOverwriteFalseOption),
        strEmailToLabel: intl.formatMessage(messages.modalScheduleEmailToLabel),
        strEmailToPlaceholder: intl.formatMessage(messages.modalScheduleEmailToPlaceholder),
        strSubjectLabel: intl.formatMessage(messages.modalScheduleSubjectLabel),
        strBodyLabel: intl.formatMessage(messages.modalScheduleBodyLabel),
        strIncludeReportLabel: intl.formatMessage(messages.modalScheduleIncludeReportLabel),
        strIncludeAsAttachmentOption: intl.formatMessage(messages.modalScheduleIncludeAsAttachmentOption),
        strIncludeAsLinkOption: intl.formatMessage(messages.modalScheduleIncludeAsLinkOption),
        strPrinterLabel: intl.formatMessage(messages.modalSchedulePrinterLabel),
        strNoPrintersLabel: intl.formatMessage(messages.modalScheduleNoPrintersLabel),
        strColorLabel: intl.formatMessage(messages.modalScheduleColorLabel),
        strColorOption: intl.formatMessage(messages.modalScheduleColorOption),
        strGrayscaleOption: intl.formatMessage(messages.modalScheduleGrayscaleOption),
        strOrientationLabel: intl.formatMessage(messages.modalScheduleOrientationLabel),
        strOrientationLandscapeOption: intl.formatMessage(messages.modalScheduleOrientationLandscapeOption),
        strOrientationPortraitOption: intl.formatMessage(messages.modalScheduleOrientationPortraitOption),
        strScheduleDuplexLabel: intl.formatMessage(messages.modalScheduleDuplexLabel),
        strDuplexNoneOption: intl.formatMessage(messages.modalScheduleDuplexNoneOption),
        strDuplexLongOption: intl.formatMessage(messages.modalScheduleDuplexLongOption),
        strDuplexShortOption: intl.formatMessage(messages.modalScheduleDuplexShortOption),
        strCopiesLabel: intl.formatMessage(messages.modalScheduleCopiesLabel),
        strSizeLabel: intl.formatMessage(messages.modalScheduleSizeLabel),
        strNotSupportedOption: intl.formatMessage(messages.modalScheduleNotSupportedOption),
        strSourceLabel: intl.formatMessage(messages.modalScheduleSourceLabel),
        strChooseScheduleLabel: intl.formatMessage(messages.modalScheduleChooseScheduleLabel),
        strChooseFormatLabel: intl.formatMessage(messages.modalScheduleChooseFormatLabel),
        strFormatPlaceholderOption: intl.formatMessage(messages.modalScheduleChooseFormatPlaceholderOption),
        strChooseFormatPdfOption: intl.formatMessage(messages.modalScheduleChooseFormatPdfOption),
        strChooseFormatXlsOption: intl.formatMessage(messages.modalScheduleChooseFormatXlsOption),
        strChooseFormatMhtOption: intl.formatMessage(messages.modalScheduleChooseFormatMhtOption),
        strChooseFormatImageOption: intl.formatMessage(messages.modalScheduleChooseFormatImageOption),
        strChooseFormatWordOption: intl.formatMessage(messages.modalScheduleChooseFormatWordOption),
        strChooseFormatXmlOption: intl.formatMessage(messages.modalScheduleChooseFormatXmlOption),
        strDeliveryLabel: intl.formatMessage(messages.modalScheduleDeliveryLabel),
        strDeliveryEmailOption: intl.formatMessage(messages.modalScheduleDeliveryEmailOption),
        strDeliveryWindowsOption: intl.formatMessage(messages.modalScheduleDeliveryWindowsOption),
        strDeliveryPrintOption: intl.formatMessage(messages.modalScheduleDeliveryPrintOption),
        strCheckingParamsText: intl.formatMessage(messages.modalScheduleCheckingParamsText),
        strSpecifyParamsText: intl.formatMessage(messages.modalScheduleSpecifyParamsText),
        strDefaultEmailSubj: intl.formatMessage(messages.modalScheduleDefaultEmailSubj),
        strDefaultEmailBody: intl.formatMessage(messages.modalScheduleDefaultEmailBody),
        strPredefinedParam: intl.formatMessage(messages.modalSchedulePredefinedParam),
        strParamRelativeDateBeginning: intl.formatMessage(messages.parametersRelativeDateBeginning),
        strParamRelativeDateEnd: intl.formatMessage(messages.parametersRelativeDateEnd),
        strParamRelativeDateCurrent: intl.formatMessage(messages.parametersRelativeDateCurrent),
        strParamRelativeDatePrevious: intl.formatMessage(messages.parametersRelativeDatePrevious),
        strParamRelativeDateNext: intl.formatMessage(messages.parametersRelativeDateNext),
        strParamRelativeDateDay: intl.formatMessage(messages.parametersRelativeDateDay),
        strParamRelativeDateWeek: intl.formatMessage(messages.parametersRelativeDateWeek),
        strParamRelativeDateMonth: intl.formatMessage(messages.parametersRelativeDateMonth),
        strParamRelativeDateQuarter: intl.formatMessage(messages.parametersRelativeDateQuarter),
        strParamRelativeDateYear: intl.formatMessage(messages.parametersRelativeDateYear),
        // Actions
        onChangeScheduleParams: scheduleActions.updateScheduleParams,
        onChangeScheduleTemplate: scheduleActions.getScheduleTemplate,
        onChangeTab: scheduleActions.assembleSchedule,
        onCreateTask: scheduleActions.createScheduleTask,
        onDismiss: uiActions.hideSchedules,
        onMount: scheduleActions.assembleSchedules,
        onRemoveTask: scheduleActions.deleteScheduleTask,
        onSubmit: scheduleActions.submitSchedules,
        onUpdateScheduleParams: parametersActions.validateReportParameters,
      } : null;
    },

    [Sidebar]: () => {
      const {intl, tags, ui, tagsActions, uiActions} = this.props;
      return {
        hideEmptyTags: ui.hideEmptyCategories,
        isSidebarVisible: ui.sidebarVisibility,
        tagsList: tags.tagsTree,
        currentDocument: tags.currentDocument,
        strUncategorized: intl.formatMessage(messages.tagsUncategorized),
        strFavorites: intl.formatMessage(messages.tagsFavorites),
        onToggleTreeNode: tagsActions.toggleTreeNode,
        onChangeTreeItem: tagsActions.selectTreeNode,
        onShowReport: tagsActions.showReport,
        //ReportsFilter
        // Data
        filterText: tags.listFilterText,
        documents: tags.documents,
        // Strings
        strInputPlaceholder: intl.formatMessage(messages.reportsFilterInputPlaceholder),
        strResetTitle: intl.formatMessage(messages.reportsFilterResetTitle),
        // Actions
        onChange: tagsActions.filterDocumentsList,
        onSelection: tagsActions.showReport,
      };
    },

    [Topbar]: () => {
       const {uiSettings,uiActions,ui} = this.props;
       return {
         uiSettings: uiSettings,
         toggleSideBar: uiActions.toggleSideBar,
         isSidebarVisible: ui.sidebarVisibility
       }
    },

    [ReportsDock]: () => {
      const {tags} = this.props;
      return {
        // Data
        document: tags.currentDocument,
      };
    },

    [ReportsFilter]: () => {
      const {documents, docsActions, intl, tags} = this.props;
      return {
        // Data
        filterText: tags.listFilterText,
        documents: tags.documents,
        // Strings
        strInputPlaceholder: intl.formatMessage(messages.reportsFilterInputPlaceholder),
        strResetTitle: intl.formatMessage(messages.reportsFilterResetTitle),
        // Actions
        onChange: docsActions.filterDocumentsList,
      };
    },

    [PropertiesDock]: () => {
      const {document, documents, intl, ui, uiActions} = this.props;
      return {
        // Data
        document,
        documentVersions: documents.revisions,
        hasDataToDisplay: !!documents.id,
        isProcessingDocument: documents.isProcessing,
        isProcessingRevisions: documents.isProcessingRevisions,
        isPropertiesVisible: ui.propertiesVisibility,
        isRevisionsVisible: ui.revisionsVisibility,
        locale: ui.locale,
        // Strings
        strSelectHint: intl.formatMessage(messages.reportPropertiesSelectHint),
        strReportOwnerLabel: intl.formatMessage(messages.reportPropertiesReportOwnerLabel),
        strCreatedDateLabel: intl.formatMessage(messages.reportPropertiesCreatedDateLabel),
        strLastModifiedLabel: intl.formatMessage(messages.reportPropertiesLastModifiedLabel),
        strModifiedByLabel: intl.formatMessage(messages.reportPropertiesModifiedByLabel),
        strRdlReportTitle: intl.formatMessage(messages.reportPropertiesRdlReportTitle),
        strPageReportTitle: intl.formatMessage(messages.reportPropertiesPageReportTitle),
        strSectionReportTitle: intl.formatMessage(messages.reportPropertiesSectionReportTitle),
        strSemanticReportTitle: intl.formatMessage(messages.reportPropertiesSemanticReportTitle),
        strDetailsTabLabel: intl.formatMessage(messages.reportPropertiesDetailsTabLabel),
        strRevisionsTabLabel: intl.formatMessage(messages.reportPropertiesRevisionsTabLabel),
        // Actions
        onHideProperties: uiActions.hideProperties,
        onHideRevisions: uiActions.hideRevisions,
        onShowRevisions: uiActions.showRevisions,
        onShowReport: this.openViewer,
      };
    },

    [ContextMenu]: () => {
      const {style, ui, uiActions} = this.props;
      return this.isCurrentToolType(ToolTypes.CONTEXT_MENU) ? {
        style,
        event: ui.currentToolContext,
        onDismiss: () => uiActions.setCurrentToolType(null),
      } : null;
    },

    [AssignTo]: () => {
      const {document, docsActions, caps, tags, intl, uiActions} = this.props;
      return this.isCurrentToolType(ToolTypes.ASSIGN_DOC) ? {
        // Data
        document,
        treeData: tags.tagsTree,
        canAssignSystemTags: caps.assignSystemTags,
        // Strings
        strCaption: intl.formatMessage(messages.modalAssignToCaption),
        strSaveLabel: intl.formatMessage(messages.modalAssignToSaveLabel),
        strCancelLabel: intl.formatMessage(messages.modalAssignToCancelLabel),
        // Actions
        onCancel: () => uiActions.setCurrentToolType(null),
        onConfirm: docsActions.updateDocumentTags,
      } : null;
    },

    [Prompt]: () => {
      const {document, documents, docsActions, tags, tagsActions, intl, uiActions} = this.props;
      if (this.isCurrentToolType(ToolTypes.CREATE_TAG)) {
        return {
          strCaption: intl.formatMessage(messages.modalPromptCreateCategoryCaption),
          strSave: intl.formatMessage(messages.modalPromptSaveLabel),
          strCancel: intl.formatMessage(messages.modalPromptCancelLabel),
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (tagName) => tagsActions.addTag(tagName, tags.tagId),
        };
      } else if (this.isCurrentToolType(ToolTypes.CREATE_TAG_ROOT)) {
        return {
          strCaption: intl.formatMessage(messages.modalPromptCreateCategoryCaption),
          strSave: intl.formatMessage(messages.modalPromptSaveLabel),
          strCancel: intl.formatMessage(messages.modalPromptCancelLabel),
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (tagName) => tagsActions.addTag(tagName),
        };
      } else if (this.isCurrentToolType(ToolTypes.RENAME_DOC)) {
        return {
          strCaption: intl.formatMessage(messages.modalPromptRenameDocumentCaption),
          strSave: intl.formatMessage(messages.modalPromptSaveLabel),
          strCancel: intl.formatMessage(messages.modalPromptCancelLabel),
          text: document.name,
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (name) => docsActions.updateDocument({name, id: documents.id}),
        };
      } else if (this.isCurrentToolType(ToolTypes.RENAME_TAG)) {
        return {
          strCaption: intl.formatMessage(messages.modalPromptRenameCategoryCaption),
          strSave: intl.formatMessage(messages.modalPromptSaveLabel),
          strCancel: intl.formatMessage(messages.modalPromptCancelLabel),
          text: tags.tagName,
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (name) => tagsActions.updateTag({name, id: tags.tagId}),
        };
      }

      return null; // hidden by default
    },

    [Confirm]: () => {
      const {document, docsActions, intl, tags, tagsActions, uiActions} = this.props;
      if (this.isCurrentToolType(ToolTypes.DELETE_DOC)) {
        return {
          strCaption: intl.formatMessage(messages.modalConfirmDeleteDocumentCaption),
          strSave: intl.formatMessage(messages.modalConfirmSaveLabel),
          strCancel: intl.formatMessage(messages.modalConfirmCancelLabel),
          strPrompt: intl.formatMessage(messages.modalConfirmPrompt, {target: document.name}),
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: () => docsActions.deleteDocument(document._id),
        };
      } else if (this.isCurrentToolType(ToolTypes.DELETE_TAG)) {
        return {
          strCaption: intl.formatMessage(messages.modalConfirmDeleteCategoryCaption),
          strSave: intl.formatMessage(messages.modalConfirmSaveLabel),
          strCancel: intl.formatMessage(messages.modalConfirmCancelLabel),
          strPrompt: intl.formatMessage(messages.modalConfirmPrompt, {target: document.tagName}),
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: () => tagsActions.deleteTag(tags.tagId),
        };
      }

      return null; // hidden by default
    },

    [MoveTo]: () => {
      const {tag, tags, tagsActions, uiActions} = this.props;
      return this.isCurrentToolType(ToolTypes.MOVE_TAG) ? {
        tagId: tags.tagId,
        tagName: tags.tagName,
        tagDesc: tag.description || '',
        treeData: tags.tagsTree,
        onCancel: () => uiActions.setCurrentToolType(null),
        onConfirm: (data) => tagsActions.updateTag(data),
      } : null;
    },
    [ReportMain]:()=>{
      const {ui} = this.props;
      return {
        isSidebarVisible: ui.sidebarVisibility
      }
    },
  };

  render() {
    return (
      <div className={this.props.className}>
        { createDataProviders(this.props.children, this.components) }
      </div>
    );
  }
}

PortalViewController.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  style: PropTypes.object,
  uiSettings: PropTypes.object,

  // Action Creators
  authActions: PropTypes.object,
  docsActions: PropTypes.object,
  parametersActions: PropTypes.object,
  permissionActions: PropTypes.object,
  portalActions: PropTypes.object,
  scheduleActions: PropTypes.object,
  tagsActions: PropTypes.object,
  uiActions: PropTypes.object,
  userActions: PropTypes.object,

  // Action Methods
  addTag: PropTypes.func,
  addToFavorites: PropTypes.func,
  assembleSchedule: PropTypes.func,
  assembleSchedules: PropTypes.func,
  createScheduleTask: PropTypes.func,
  deleteDocument: PropTypes.func,
  deleteScheduleTask: PropTypes.func,
  deleteTag: PropTypes.func,
  filterDocumentsList: PropTypes.func,
  selectDocument: PropTypes.func,
  getDocument: PropTypes.func,
  getModels: PropTypes.func,
  getPermissions: PropTypes.func,
  getSchedule: PropTypes.func,
  getScheduleTemplate: PropTypes.func,
  getSiteSettings: PropTypes.func,
  getTags: PropTypes.func,
  getUserInfo: PropTypes.func,
  initPortal: PropTypes.func,
  logOut: PropTypes.func,
  removeFromFavorites: PropTypes.func,
  selectTreeNode: PropTypes.func,
  showReport: PropTypes.func,
  setSortFlag: PropTypes.func,
  submitSchedules: PropTypes.func,
  toggleTreeNode: PropTypes.func,
  updateDocument: PropTypes.func,
  updateDocumentTags: PropTypes.func,
  updatePermissions: PropTypes.func,
  updateScheduleParams: PropTypes.func,
  updateTag: PropTypes.func,
  toggleSideBar: PropTypes.func,

  // UI Action Creators
  hideNotification: PropTypes.func,
  hidePermissions: PropTypes.func,
  hideProperties: PropTypes.func,
  hideReportDialog: PropTypes.func,
  hideRevisions: PropTypes.func,
  hideSchedules: PropTypes.func,
  hideSidebar: PropTypes.func,
  setCurrentToolType: PropTypes.func,
  showPermissions: PropTypes.func,
  showProperties: PropTypes.func,
  showReportDialog: PropTypes.func,
  showRevisions: PropTypes.func,
  showSchedules: PropTypes.func,
  showSidebar: PropTypes.func,
  showViewer: PropTypes.func,
  toggleProperties: PropTypes.func,

  // Reducers
  auth: PropTypes.object,
  caps: PropTypes.object,
  document: PropTypes.object,
  documents: PropTypes.object,
  intl: PropTypes.object,
  operations: PropTypes.object,
  parameters: PropTypes.object,
  permissions: PropTypes.object,
  printers: PropTypes.object,
  schedule: PropTypes.object,
  tag: PropTypes.object,
  tags: PropTypes.object,
  ui: PropTypes.object,
  user: PropTypes.object,
  viewer: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  caps: state.user.caps,
  document: state.documents.data,
  documents: state.documents,
  intl: state.intl,
  operations: state.documents.operations,
  parameters: state.parameters,
  permissions: state.permissions,
  printers: state.printers,
  schedule: state.schedule,
  tag: state.tags.data,
  tags: state.tags,
  ui: state.ui,
  user: state.user,
  uiSettings: state.app
});

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(authActionCreators, dispatch),
  docsActions: bindActionCreators(documentsActionsCreators, dispatch),
  parametersActions: bindActionCreators(parametersActionCreators, dispatch),
  permissionActions: bindActionCreators(permissionActionsCreators, dispatch),
  portalActions: bindActionCreators(portalActionCreators, dispatch),
  scheduleActions: bindActionCreators(scheduleActionsCreators, dispatch),
  tagsActions: bindActionCreators(tagsActionsCreators, dispatch),
  uiActions: bindActionCreators(uiActionCreators, dispatch),
  userActions: bindActionCreators(userActionCreators, dispatch),
});

PortalViewController.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortalViewController);
