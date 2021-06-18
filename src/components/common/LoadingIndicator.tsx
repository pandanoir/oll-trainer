import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'twin.macro';

export const LoadingIndicator = () => (
  <FontAwesomeIcon tw="animate-spin duration-700" icon={faSpinner} />
);
