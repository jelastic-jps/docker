var resp = jelastic.billing.account.GetQuotas(appid, session, [
   'environment.externalip.enabled',
   'environment.externalip.maxcount',
   'environment.externalip.maxcount.per.node'
].join(";"));

if (resp.result != 0) return resp;
var ipQuotas = resp, resp = {result: 0};
if (ipQuotas.array[0].value != 0 && ipQuotas.array[1].value > 0 && ipQuotas.array[2].value > 0) {   
   var r = jelastic.env.control.GetEnvInfo('${env.name}', session), nodes = [];
   if (r.result != 0) return r;
   var targetGroup = "cp";
   for (var i = r.nodes.length; i--;)
     if (r.nodes[i].nodeGroup == targetGroup)
         nodes.push(r.nodes[i].id);
   
   resp.onAfterReturn = [
     "env.binder.AttachExtIp["+nodes.join(',')+"]"
   ]
};

return resp;
