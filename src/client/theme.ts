import { createMuiTheme } from "@material-ui/core/styles";

import styleVars from "./styleVariables";

export const elovateTheme = createMuiTheme({
    palette: {
        primary: {
            main: styleVars.color1
        },
        secondary: {
            main: styleVars.color2
        }
    }
});
