
/*
 Configuration
 -------------
`title`: The title to use for the generated HTML document.
`basename`: Update basename if running in a subdirectory or set as "/" if app runs in root.
`analytics`: Google Analytics: change UA-XXXXX-Y to be your site's ID (http://analytics.google.com/).
`arServer`: ActiveReports 11 Server.
*/

export const settings = {
  title: 'ActiveReports 11 报表服务器',
  basename: '',
  languages: ['ru'], // Please do not include the default language (EN), react-intl will automatically include it.
  analytics: {
    google: {
      trackingId: 'UA-XXXXX-Y',
    },
  }
};

//dev
const getArServer = ()=>'http://localhost:8070';

// Assemble endpoints
export const endpoints = {
  arsRest: ()=> getArServer() + '/api',
  arsBaseLocation: ()=> getArServer(),
  arsResourceHandler: ()=> getArServer() + '/cache/',
  arsDefaultHandler: ()=> getArServer() + '/Default.aspx',
  arsDesignerService: ()=> getArServer() + '/DesignerService.svc',
};
