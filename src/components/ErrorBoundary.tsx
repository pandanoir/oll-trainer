import { ErrorInfo, PureComponent } from 'react';

export class ErrorBoundary extends PureComponent<Record<string, unknown>> {
  state = { hasError: false, errorMessage: '' };
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      hasError: true,
      errorMessage: JSON.stringify({
        ...errorInfo,
        message: error.message,
        name: error.name,
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
          <textarea style={{ width: 300, height: 200 }}>
            {this.state.errorMessage}
          </textarea>
        </div>
      );
    }

    return this.props.children;
  }
}
