import { createReducer } from '../utils/index';
import ActionTypes from '../constants/ActionTypes';
import UISettings from '../constants/UISettings';

const initialState = Object.assign({}, {
  isProcessing:false,
  enabled:false,
  showLogo:true
}, UISettings.defaultAddtionalSettings,UISettings.defaultUISettings);

export default createReducer(initialState, {

  [ActionTypes.REQUEST_UI_SETTINGS]: (state) =>
    Object.assign({}, state, {
      isProcessing: true,
    }),

  [ActionTypes.RECEIVE_UI_SETTINGS]: (state, payload) => {
    let enabled = payload.enabled;
    let showLogo = payload.commonSiteSettings.showLogo;
    let newState;

    if(enabled){
      let portalSettings = payload.portalSiteSettings;
      let themeName = portalSettings.theme || state.theme;
      let themeColorScheme = UISettings[themeName];
      let {title,theme,...customeColorScheme} = payload.portalSiteSettings;
      let addtionalSettings = themeName === 'fresh' ? UISettings.freshAddtionalSettings : UISettings.defaultAddtionalSettings;
      
      newState = Object.assign({}, state, addtionalSettings, {
        isProcessing: false,
        enabled,
        showLogo,
        title: portalSettings.title || state.title,
        theme: themeName,
        colorScheme:Object.assign({}, themeColorScheme, customeColorScheme),
      })

      if(!showLogo){
        newState.loginlogo = null;
        newState.headerlogo = null;
        newState.mobilelogo = null;
      }
    }else {
       newState = Object.assign({}, state, {isProcessing: false, showLogo});
    }

    insertCssToHead([{
      name:'.topBar',
      style: {
        background:newState.colorScheme.headerBackgroundColor,
        color:newState.colorScheme.headerTextColor
      }
    },{
      name: '.topBar [role="button"]:hover',
      style: {
         background:newState.colorScheme.headerHoverBackgroundColor,
         color: newState.headerHoverTextColor
      }
    },{
      name: '.topBar [role="button"][data-state="active"]',
      style: {
         background:newState.colorScheme.headerHoverBackgroundColor,
         color: newState.headerHoverTextColor
      },
    }, {
      name: '.sideBar',
      style: {
         background:newState.colorScheme.siderBarBackgroundColor,
         color:newState.colorScheme.siderBarTextColor
      }
    }, {
      name: '.sideBar li[data-state="active"]:before',
      style: {
         background:newState.colorScheme.siderBarActiveItemBackgroundColor
      }
    },{
      name: '.sideBar li[data-state="active"]',
      style: {
         color:newState.colorScheme.sideBarActiveItemTextColor
      }
    },{
      name: '.sideBar li[data-state="hover"]:before',
      style: {
         background:'rgba(100,100,100,0.15)'
      }
    }]);
    document.title = newState.title;

    return newState;
  },
    
    [ActionTypes.RECEIVE_UI_LOGO]: (state, payload, meta) => {
      let newState;
      if(state.enabled && (state.showLogo || meta ==='favicon')){
         newState = Object.assign({}, state, {
           [meta]:payload
       });
      }else {
         newState = Object.assign({}, state, {isProcessing: false});
      }

      if(meta === 'favicon'){
         changeFavicon(newState.favicon);
      }
      return newState;
    }
});

function changeFavicon(favicon){
    var link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.rel = 'shortcut icon';
    link.type = 'image/x-icon';
    link.href = favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
}

function insertCssToHead(cssClass) {
    let head = document.getElementsByTagName('head')[0];
    let s = document.createElement('style');
    let cssText = '';
    cssClass.forEach((css)=> {cssText += serializeCssClass(css)})
       
    if (cssText) {
        s.setAttribute('type', 'text/css');
        s.setAttribute('style-type', 'columnstyle');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = cssText;
         } else {                // the world
            s.appendChild(document.createTextNode(cssText));
         }
         var buildInStyle = head.querySelector('[style-type="columnstyle"]');
         if (buildInStyle) {
             head.removeChild(buildInStyle);
        }
        head.appendChild(s);
    }
}

 function serializeCssClass(cssClass) {
    let style = cssClass.style;
    let content = cssClass.name + '{' + '\n';
    Object.keys(style).forEach((pro)=> {content += pro + ':' + style[pro] + ';\n'});
    content += '}\n';
    return content;
  }
