import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Spotify1 from './widgets/spotify/spotify1'
import Spotify2 from './widgets/spotify/spotify2'
import Reddit1 from './widgets/reddit/reddit1'
import Reddit2 from './widgets/reddit/reddit2'
import Github1 from './widgets/github/github1'
import Github2 from './widgets/github/github2'

import _ from "lodash";

import "./style/grid.css";

const ReactGridLayout = WidthProvider(RGL);

const getId = () => {
  return (Math.random().toString(12).substring(2, 8) + Math.random().toString(12).substring(2, 8));
};

export default class Grid extends React.PureComponent {
  static defaultProps = {
    isResizable: false,
    className: "layout",
    cols: 12,
    rowHeight: 100,
    onLayoutChange: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      layout: JSON.parse(JSON.stringify(getFromStore("layout")))
    };
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  onLayoutChange(layout) {
    saveToLS("layout", layout);
    this.setState({ layout });
    this.props.onLayoutChange(layout);
  }

  addNewItem = (str) => {
    const { layout } = this.state;
    let newItem;
    if (str === "reddit1")
      newItem = { x: 0, y: 0, w: 3, h: 6, i: (str + "-" + getId()) };
    else
      newItem = { x: 0, y: 0, w: 3, h: 3, i: (str + "-" + getId()) };

    if (layout.some(item => item.x === 0 && item.y === 0)) {
      this.setState({
        layout: layout
          .map(item => {
            if (item.x === 0) {
              return { y: item.y++, ...item };
            }
            return item;
          })
          .concat([newItem])
      });
    } else {
      this.setState({ layout: layout.concat([newItem]) });
    }
  };

  onRemoveItem(i) {
    this.setState({ layout: _.reject(this.state.layout, { i: i }) });
  }

  render() {
    return (
      <div>
        <div style={{marginTop: 20}}>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  Add Widget
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={() => (this.addNewItem("spotify1"))}>Spotify Widget 1</MenuItem>
                  <MenuItem onClick={() => (this.addNewItem("spotify2"))}>Spotify Widget 2</MenuItem>
                  <MenuItem onClick={() => (this.addNewItem("reddit1"))}>Reddit Widget 1</MenuItem>
                  <MenuItem onClick={() => (this.addNewItem("reddit2"))}>Reddit Widget 2</MenuItem>
                  <MenuItem onClick={() => (this.addNewItem("github1"))}>Github Widget 1</MenuItem>
                  <MenuItem onClick={() => (this.addNewItem("github2"))}>Github Widget 2</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </div>
        <div className="grid">
          {(this.state.layout.length === 0)
            ? <h1>Please Link your account and add widgets</h1>
            : <ReactGridLayout
                style={{marginTop: 20}}
                {...this.props}
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange}
              >
              {this.state.layout.map(item => (
                <div key={item.i} data-grid={item}>
                  <span
                    className="remove"
                    onClick={this.onRemoveItem.bind(this, item.i)}
                    style={{color: "#fff", fontFamily: 'Roboto', position: "absolute", right: "15px", top: "-6px", cursor: "pointer"}}
                  >
                    x
                  </span>
                  {(item.i.search("spotify1") >= 0)
                    ? <Spotify1 id={item.i} />
                    : (item.i.search("spotify2") >= 0)
                    ? <Spotify2 id={item.i} />
                    : (item.i.search("reddit1") >= 0)
                    ? <Reddit1 id={item.i} />
                    : (item.i.search("reddit2") >= 0)
                    ? <Reddit2 id={item.i} />
                    : (item.i.search("github1") >= 0)
                    ? <Github1 id={item.i} />
                    : <Github2 id={item.i} />
                  }
                </div>
              ))}
            </ReactGridLayout>
          }
        </div>
      </div>
    );
  }
}

function getFromStore(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-7",
      JSON.stringify({
        [key]: value
      })
    );
  }
}