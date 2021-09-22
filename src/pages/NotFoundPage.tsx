import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'twin.macro';
import { PrimaryLinkButton } from '../components/common/PrimaryLinkButton';

export const NotFoundPage = () => (
  <div tw="px-3">
    <div tw="text-3xl py-3 border-b-2 mb-3">
      <FontAwesomeIcon icon={faSadTear} /> Not found
    </div>
    <div>すみません、お探しのページが見つかりませんでした…</div>
    <div>
      <PrimaryLinkButton to="/">Home に戻る</PrimaryLinkButton>
    </div>
  </div>
);
