'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function DemoPage() {
  const { data: session, status } = useSession()

  const handleTestLogin = async () => {
    const result = await signIn('credentials', {
      email: 'test@example.com',
      password: 'test123',
      redirect: false
    })
    
    if (result?.error) {
      toast.error('Login failed: ' + result.error)
    } else {
      toast.success('Login successful!')
    }
  }

  const handleGoogleLogin = () => {
    toast.info("Google OAuth not configured. Please follow the setup guide in OAUTH_SETUP_GUIDE.md")
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
    toast.success('Logged out successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Authentication Demo</h1>
          <p className="text-gray-600">Test the authentication system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Current session information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Status:</strong> {status}
              </div>
              {session ? (
                <div className="space-y-2">
                  <div><strong>User:</strong> {session.user?.name}</div>
                  <div><strong>Email:</strong> {session.user?.email}</div>
                  <div><strong>ID:</strong> {session.user?.id}</div>
                </div>
              ) : (
                <div className="text-gray-500">Not authenticated</div>
              )}
            </CardContent>
          </Card>

          {/* Test Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <CardDescription>Try different authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTestLogin}
                className="w-full"
                variant="outline"
              >
                Test Login (test@example.com / test123)
              </Button>
              
              <Button 
                onClick={handleGoogleLogin}
                className="w-full"
                variant="outline"
                disabled
              >
                Login with Google (Not Configured)
              </Button>
              
              {session && (
                <Button 
                  onClick={handleLogout}
                  className="w-full"
                  variant="destructive"
                >
                  Logout
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">For Google OAuth:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Follow the instructions in <code>GOOGLE_OAUTH_SETUP.md</code></li>
                  <li>Add your Google OAuth credentials to <code>.env.local</code></li>
                  <li>Restart the development server</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Test Credentials:</h3>
                <p className="text-sm">
                  Email: <code>test@example.com</code><br/>
                  Password: <code>test123</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
