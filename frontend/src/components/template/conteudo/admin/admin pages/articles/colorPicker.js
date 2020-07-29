import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';
import { FaPaintBrush  } from "react-icons/fa";
import './styles.css'

class ColorPic extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (color) => {
    const { onChange } = this.props;
    onChange('color', color.hex);
  }

  renderModal = () => {
    const { color } = this.props.currentState;
    return (
       <div onClick={this.stopPropagation}>
           
       <SwatchesPicker    color={color} onChangeComplete={this.onChange} />
       </div>
    );
  };

  render() {
    const { expanded, onExpandEvent } = this.props;
    return (
      <div className='min'
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
      >
        <div 
          onClick={onExpandEvent}
        >
        <div className='colorPiker'>
        <FaPaintBrush size={16}/>
        </div>
          
        </div>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}
export default ColorPic