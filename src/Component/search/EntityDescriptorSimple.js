import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import './SearchForm.css';
import {getClickableEntityLink} from "../../Utils";

/**
 * Highlight a descriptor with link to the reference vocabulary
 */
const EntityDescriptorSimple = (props) => {
    const {
        id,
        label,
        link,
    } = props;


    return (
        <span className="entity">
            <Button id={id} type="button" className="btn highlight-descriptor">
                <a className="entity-link" href={getClickableEntityLink(link)} target="_external_entity">
                    {label}
                </a>
            </Button>
        </span>
    );
}

EntityDescriptorSimple.propTypes = {
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
}

export default EntityDescriptorSimple;
