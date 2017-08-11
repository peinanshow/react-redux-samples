
 const defaultTheme = {
      headerBackgroundColor:'#262D40',
      headerTextColor:'#ffffff',
      headerHighlightedBackgroundColor:'#394360',
      headerHoverBackgroundColor:'#394360',
      siderBarBackgroundColor:'#EDEDEB',
      siderBarTextColor:'#2D2F35',
      siderBarActiveItemBackgroundColor:'#ffffff',
      sideBarActiveItemTextColor:'#3c3c3c'
   };


const Settings = {
   default: defaultTheme,
   aurora: {
      headerBackgroundColor:'#072e46',
      headerTextColor:'#00e5be',
      headerHighlightedBackgroundColor:'#075075',
      headerHoverBackgroundColor:'#00bb9b',
      siderBarBackgroundColor:'#105375',
      siderBarTextColor:'#ffffff',
      siderBarActiveItemBackgroundColor:'#00bb9b',
      sideBarActiveItemTextColor:'#ffffff'
   },

   cloudy: {
      headerBackgroundColor:'#9198a2',
      headerTextColor:'#38424a',
      headerHighlightedBackgroundColor:'#afb5bd',
      headerHoverBackgroundColor:'#d3d6d8',
      siderBarBackgroundColor:'#f8f8f9',
      siderBarTextColor:'#4c5356',
      siderBarActiveItemBackgroundColor:'#3896de',
      sideBarActiveItemTextColor:'#ffffff'
   },
   
   contrast: {
      headerBackgroundColor:'#000000',
      headerTextColor:'#ffffff',
      headerHighlightedBackgroundColor:'transparent',
      headerHoverBackgroundColor:'#ffffff',
      siderBarBackgroundColor:'#ffffff',
      siderBarTextColor:'#000000',
      siderBarActiveItemBackgroundColor:'#000000',
      sideBarActiveItemTextColor:'#ffffff'
   },

   light: {
      headerBackgroundColor:'#b4bcc7',
      headerTextColor:'#ffffff',
      headerHighlightedBackgroundColor:'#b4bcc7',
      headerHoverBackgroundColor:'rgb(144,150,159)',
      siderBarBackgroundColor:'#ffffff',
      siderBarTextColor:'#4c5356',
      siderBarActiveItemBackgroundColor:'#e2e4e6',
      sideBarActiveItemTextColor:'#4b5058'
   },

   superhero: {
      headerBackgroundColor:'#d61f26',
      headerTextColor:'#ffffff',
      headerHighlightedBackgroundColor:'#a1171d',
      headerHoverBackgroundColor:'#c11c22',
      siderBarBackgroundColor:'#343b46',
      siderBarTextColor:'#d8dbe0',
      siderBarActiveItemBackgroundColor:'rgb(37,41,49)',
      sideBarActiveItemTextColor:'#ffffff'
   },

   winter: {
      headerBackgroundColor:'#055498',
      headerTextColor:'#ffffff',
      headerHighlightedBackgroundColor:'#5089b7',
      headerHoverBackgroundColor:'#ffffff',
      siderBarBackgroundColor:'#f4f4f4',
      siderBarTextColor:'#4c5356',
      siderBarActiveItemBackgroundColor:'#6aa8da',
      sideBarActiveItemTextColor:'#ffffff',
   },

   fresh: {
      headerBackgroundColor:'#2a2a3a',
      headerTextColor:'#ffffff',
      headerHighlightedBackgroundColor:'#36415a',
      headerHoverBackgroundColor:'#36415a',
      siderBarBackgroundColor:'#313146',
      siderBarTextColor:'#ffffff',
      siderBarActiveItemBackgroundColor:'#2a2a3a',
      sideBarActiveItemTextColor:'#ffffff',
   },

   defaultUISettings: {
      title: 'ActiveReports 11 报表服务器',
      colorScheme: defaultTheme,
      loginlogo: './branding/portal-auth-default-logo.png',
      headerlogo:'./branding/portal-main-mobile-logo.png',
      mobilelogo:'./branding/portal-main-mobile-logo.png',
      favicon:null,
      theme:'default'
   },

   defaultAddtionalSettings: {
      loginFormBackgroundColor:'#ffffff',
      loginInputContentBackgroundColor:'#ffffff',
      loginInputContentColor:'inherit',
      loginInputIconBackgroundColor:'rgb(216, 216, 216)',
      loginButtonBackground: '#428bca',
      loginKeeplogColor:'inherit',
      loginBackgroundImage: './branding/portal-auth-default-background.png',
      headerHoverTextColor: 'black'
  },

   freshAddtionalSettings: {
      loginFormBackgroundColor:'rgba(255,255,255, 0.15)',
      loginInputContentBackgroundColor:'rgba(246, 246, 246, 0.6)',
      loginInputContentColor:'white',
      loginInputIconBackgroundColor:'#a4a5ad',
      loginButtonBackground: '#35a8dd',
      loginKeeplogColor:'white',
      loginBackgroundImage: './branding/portal-auth-fresh-background.png',
      loginlogo: './branding/portal-auth-fresh-logo.png',
      headerHoverTextColor: 'white'
   },

   phoneScreen:480
};

export default Settings;
