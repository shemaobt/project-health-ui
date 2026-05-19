import { Route, Switch } from 'wouter';
import { PH_ADMIN_ROLE } from './lib/constants';
import ProtectedRoute from './components/ProtectedRoute';

import Welcome from './pages/Welcome';
import Interview from './pages/Interview';
import Completion from './pages/Completion';
import TeamReport from './pages/TeamReport';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';
import AdminReport from './pages/AdminReport';
import AdminInterviewView from './pages/AdminInterviewView';
import AdminPrompts from './pages/AdminPrompts';
import InviteAdmin from './pages/InviteAdmin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/interview/:id">
        {(params) => <Interview interviewId={params.id} />}
      </Route>
      <Route path="/completion" component={Completion} />
      <Route path="/team-report/:reportId">
        {(params) => <TeamReport reportId={params.reportId} />}
      </Route>

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      <Route path="/pending-approval">
        <ProtectedRoute requireAppRole={false}>
          <PendingApproval />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute requireRoleKey={PH_ADMIN_ROLE}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/interviews/:interviewId">
        {(params) => (
          <ProtectedRoute requireRoleKey={PH_ADMIN_ROLE}>
            <AdminInterviewView interviewId={params.interviewId} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/reports/:reportId">
        {(params) => (
          <ProtectedRoute requireRoleKey={PH_ADMIN_ROLE}>
            <AdminReport reportId={params.reportId} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/invite">
        <ProtectedRoute requireRoleKey={PH_ADMIN_ROLE}>
          <InviteAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/prompts">
        <ProtectedRoute requirePlatformAdmin>
          <AdminPrompts />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}
