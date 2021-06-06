import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tw from 'twin.macro';

export const TweetButton = ({ text }: { text: string }) => {
  return (
    <a
      className="twitter-share-button"
      css={[
        tw`inline-block break-normal whitespace-nowrap pr-1.5 pl-2 rounded border-b`,
        tw`bg-blue-300 text-white border-blue-400`,
        tw`dark:bg-blue-600 dark:text-white dark:border-blue-800`,
      ]}
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=%20`}
      target="_blank"
      rel="noreferrer"
    >
      <FontAwesomeIcon icon={faTwitter} /> Tweet
    </a>
  );
};
