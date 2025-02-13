import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Dashboard from "@/pages/dashboard";
import WordsIndex from "@/pages/words/index";
import WordShow from "@/pages/words/[id]";
import GroupsIndex from "@/pages/groups/index";
import GroupShow from "@/pages/groups/[id]";
import StudySessionsIndex from "@/pages/study-sessions/index";
import CreateStudySession from "@/pages/study-sessions/create";
import StudySessionShow from "@/pages/study-sessions/[id]";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/words" component={WordsIndex} />
          <Route path="/words/:id" component={WordShow} />
          <Route path="/groups" component={GroupsIndex} />
          <Route path="/groups/:id" component={GroupShow} />
          <Route path="/study-sessions/create" component={CreateStudySession} />
          <Route path="/study-sessions" component={StudySessionsIndex} />
          <Route path="/study-sessions/:id" component={StudySessionShow} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;