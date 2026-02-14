import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  globalErrors: Array<{ error: any; timestamp: number; type: string }>
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    globalErrors: []
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, globalErrors: [] }
  }

  public componentDidMount() {
    // Capture all unhandled errors
    window.addEventListener('error', this.handleGlobalError)
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  public componentWillUnmount() {
    window.removeEventListener('error', this.handleGlobalError)
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  private handleGlobalError = (event: ErrorEvent) => {
    console.error('Global error caught:', event.error || event.message)
    this.setState(prev => ({
      hasError: true,
      error: event.error || new Error(event.message),
      globalErrors: [
        ...prev.globalErrors,
        {
          error: event.error || event.message,
          timestamp: Date.now(),
          type: 'error'
        }
      ]
    }))
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason)
    this.setState(prev => ({
      hasError: true,
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      globalErrors: [
        ...prev.globalErrors,
        {
          error: event.reason,
          timestamp: Date.now(),
          type: 'promise'
        }
      ]
    }))
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.900"
          color="white"
          p={4}
          overflow="auto"
        >
          <VStack spacing={4} maxW="800px" w="100%" textAlign="center">
            <Heading size="xl" color="red.400">
              Something went wrong
            </Heading>
            <Text fontSize="md" color="gray.300">
              The application encountered an error. Error details below:
            </Text>

            {/* Main Error */}
            {this.state.error && (
              <Box
                bg="gray.800"
                p={4}
                borderRadius="md"
                w="100%"
                textAlign="left"
                fontSize="sm"
                fontFamily="monospace"
                overflow="auto"
                maxH="300px"
                border="2px solid"
                borderColor="red.500"
              >
                <Text color="red.300" fontWeight="bold" mb={2}>
                  Main Error:
                </Text>
                <Text color="red.300" fontWeight="bold">
                  {this.state.error.toString()}
                </Text>
                {this.state.error.stack && (
                  <Text color="gray.400" mt={2} fontSize="xs" whiteSpace="pre-wrap">
                    {this.state.error.stack}
                  </Text>
                )}
                {this.state.errorInfo && (
                  <Text color="gray.400" mt={2} fontSize="xs">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </Box>
            )}

            {/* Additional Global Errors */}
            {this.state.globalErrors.length > 0 && (
              <Box w="100%">
                <Text color="yellow.400" fontWeight="bold" mb={2}>
                  Additional Errors ({this.state.globalErrors.length}):
                </Text>
                {this.state.globalErrors.map((errDetail, idx) => (
                  <Box
                    key={idx}
                    bg="gray.800"
                    p={3}
                    borderRadius="md"
                    w="100%"
                    textAlign="left"
                    fontSize="xs"
                    fontFamily="monospace"
                    overflow="auto"
                    maxH="200px"
                    mb={2}
                    border="1px solid"
                    borderColor="yellow.600"
                  >
                    <Text color="yellow.300" fontWeight="bold">
                      [{errDetail.type}] {new Date(errDetail.timestamp).toLocaleTimeString()}
                    </Text>
                    <Text color="yellow.200" mt={1} whiteSpace="pre-wrap">
                      {errDetail.error?.toString() || String(errDetail.error)}
                    </Text>
                    {errDetail.error?.stack && (
                      <Text color="gray.500" mt={1} fontSize="xx-small" whiteSpace="pre-wrap">
                        {errDetail.error.stack}
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            <Button
              colorScheme="blue"
              size="lg"
              onClick={this.handleReload}
              mt={4}
            >
              Reload Application
            </Button>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
