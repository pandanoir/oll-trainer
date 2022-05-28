import { ErrorInfo, PropsWithChildren, PureComponent } from 'react';

const localStorageToString = () => {
  const localStorageValue: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === null) continue;
    const item = localStorage.getItem(key);
    if (item === null) continue;
    localStorageValue[key] = item;
  }
  return JSON.stringify(localStorageValue);
};
export class ErrorBoundary extends PureComponent<
  PropsWithChildren<Record<string, unknown>>
> {
  state = { hasError: false, errorMessage: '' };
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      hasError: true,
      errorMessage: JSON.stringify({
        ...errorInfo,
        message: error.message,
        name: error.name,
        localStorage: localStorageToString(),
      }),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>
            Something went wrong. Please report this to{' '}
            <a href="https://twitter.com/pandanoir9">@pandanoir9</a>.
          </h1>
          <textarea
            readOnly
            style={{
              width: 300,
              height: 200,
              color: 'black',
              background: 'white',
            }}
          >
            {this.state.errorMessage}
          </textarea>
        </div>
      );
    }

    return this.props.children;
  }
}
