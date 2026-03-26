import React, {useState, useEffect} from 'react';
import LayoutAdmin from '../../LayoutAdmin';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Categories from './CATEGORIE/Categories';
import Unites from './UNITE/Unites';
import CbmModif from './CBM/CbmModif';
import Localisations from './LOCALISATION/Localisations';
import { createTheme } from '@mui/material/styles';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      aria-current={props.selected && 'page'}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

const theme = createTheme({
  palette: {
    primary: {
      // light: '#757ce8',
      light: '#2196f3',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

function Parametres() {
    document.title = "Paramètrage du plateforme";
    const [value, setValue] = useState(0);
    
    const getTabFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      return tab ? parseInt(tab, 10) : 0; // default to first tab if tab param not provided
    };
  
    useEffect(() => {
      // Set initial tab value from URL when component mounts
      setValue(getTabFromURL());
    }, []);

    const handleChange = (event, newValue) => {
      // event.type can be equal to focus with selectionFollowsFocus.
      if (
        event.type !== 'click' ||
        (event.type === 'click' && samePageLinkNavigation(event))
      ) {
        setValue(newValue);
      }
    };
    return(
        <LayoutAdmin>
          <Box>
            <div style={{ color: theme.palette.primary.light, fontWeight: 'bold' }}>PARAMÈTRAGE DU PLATEFORME</div>
            <Box component="section" sx={{ marginTop: 2, border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                <Tabs value={value} onChange={handleChange} aria-label="Parametres" role="navigation">
                    <LinkTab label="Catégories" href="/categories" />
                    <LinkTab label="Unité d'echange" href="/unite" />
                    <LinkTab label="CBM Min" href="/cbm" />
                    <LinkTab label="Localisation" href="/localisation" />
                </Tabs>
                <Box>
                  <CustomTabPanel value={value} index={0}>
                    <Categories />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Unites />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <CbmModif />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                    <Localisations />
                  </CustomTabPanel>
                </Box>
            </Box>
          </Box>
        </LayoutAdmin>
    )
}

export default Parametres;