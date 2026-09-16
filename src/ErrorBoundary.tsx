import {Component,type ErrorInfo,type ReactNode} from 'react';
import './LaunchSafety.css';

type Props={children:ReactNode};
type State={failed:boolean};

export default class ErrorBoundary extends Component<Props,State>{
 state:State={failed:false};

 static getDerivedStateFromError():State{return{failed:true}}

 componentDidCatch(error:Error,info:ErrorInfo){
  console.error('[FailLab] Unhandled UI error',error,info.componentStack);
 }

 private recover=()=>{
  try{sessionStorage.removeItem('faillab-last-screen')}catch{}
  window.location.reload();
 };

 render(){
  if(!this.state.failed)return this.props.children;
  return <main className="launch-error" role="alert" aria-live="assertive">
   <section>
    <div className="launch-error-logo">F</div>
    <p className="launch-error-kicker">FAILSAFE MODE</p>
    <h1>FailLab hit an unexpected error.</h1>
    <p>Your saved progress is not intentionally cleared. Reload the app and continue your investigation.</p>
    <button type="button" onClick={this.recover}>Reload FailLab</button>
   </section>
  </main>;
 }
}
