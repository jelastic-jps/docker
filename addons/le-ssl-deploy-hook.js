nodeId = getParam('nodeId');
envName = getParam('envName');
envAppid = getParam('envAppid');
envDomain = getParam('envDomain');
scriptName = getParam('action') == 'uninstall' ? 'undeployLE.sh' : 'deployLE.sh';

resp = jelastic.environment.control.GetNodeInfo(envAppid, session, nodeId);
if (resp.result != 0) return resp;

if (resp.node && resp.node.nodeGroup == "bl") return {result: 0}

//getting first custom domain
customDomains = (getParam('customDomains') || "").replace(/^\s+|\s+$/gm , "").split(/\s*[;,\s]\s*/).shift(); 
domain = customDomains || envDomain;

//executing custom deployment hook script on master node
resp = jelastic.env.control.ExecCmdById(envName, session, nodeId, toJSON([{ command:'/bin/bash ' + scriptName}]), true);
return resp;
