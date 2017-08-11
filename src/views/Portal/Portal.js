import React from "react";
import s from "./Portal.scss";

// Common Components


// Portal Components
/**
 * This module represents the portal view.
 *
 * This way activities that require authorization.
 * MUST be shown to user only when user is logged in.
 *
 */
const PortalView = (props) => (
    <div style={s} className={s.root} {...props}>

       
    </div>
);

export default PortalView;
