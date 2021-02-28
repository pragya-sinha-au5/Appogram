import React , {useRef}from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faHome,
  faSearch,
  faPlus,
  faInfoCircle,
  faBell
} from '@fortawesome/free-solid-svg-icons';


export const Header = () => (

  <div className="topIcons">
    <span className="topHomeIcon">
      <FontAwesomeIcon icon="home" size="lg" />
    </span>
    <span className="topTrelIcon">
      <FontAwesomeIcon icon={['fab', 'trello']} size="lg" /> Boards{' '}
    </span>
    <span data target="modal1" className="topSearchIcon modal-trigger">
      <input className="input" />
      <FontAwesomeIcon icon="search" size="lg" />
    </span>
    <span className="topTitleIcon">
      <FontAwesomeIcon icon={['fab', 'trello']} size="lg" /> Trello{' '}
    </span>
     
    <span className="topPlusIcon">
      <FontAwesomeIcon icon="plus" size="lg" />
    </span>
    <span className="topInfoIcon">
      <FontAwesomeIcon icon="info-circle" size="lg" />
    </span>
  
    
    <div id="modal1" class="modal">
    <div className="modal-content">
      <h4>Modal Header</h4>
      <p>A bunch of text</p>
    </div>
    <div className="modal-footer">
      <button class="modal-close waves-effect waves-green btn-flat">Agree</button>
    </div>
  </div>
  </div>
);
library.add(fab, faHome, faSearch, faPlus, faInfoCircle, faBell);
