import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Alert, Container } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container className="py-5 text-center">
          <Alert variant="danger">
            <Alert.Heading>Įvyko klaida!</Alert.Heading>
            <p>
              {this.state.error?.message || 'Nežinoma klaida. Bandykite perkrauti puslapį.'}
            </p>
            <hr />
            <div className="d-flex justify-content-center">
              <Button 
                onClick={this.resetErrorBoundary}
                variant="outline-danger"
              >
                Bandyti dar kartą
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="danger"
                className="ms-2"
              >
                Perkrauti puslapį
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 