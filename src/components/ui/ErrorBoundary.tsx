import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
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
          p={8}
        >
          <VStack spacing={6} maxW="600px" textAlign="center">
            <Heading size="xl" color="red.400">
              Something went wrong
            </Heading>
            <Text fontSize="lg" color="gray.300">
              The application encountered an unexpected error. Please try reloading the page.
            </Text>
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
                maxH="200px"
              >
                <Text color="red.300" fontWeight="bold">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text color="gray.400" mt={2} fontSize="xs">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </Box>
            )}
            <Button
              colorScheme="blue"
              size="lg"
              onClick={this.handleReload}
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
