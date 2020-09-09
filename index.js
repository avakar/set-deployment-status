const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

function parseState(state) {
  if (state === 'true') {
    return 'success';
  } else if (state === 'false') {
    return 'failure';
  } else {
    return state;
  }
}

async function main() {
  const deployment_id = parseInt(core.getInput('deployment_id') || context.payload.deployment.id);
  const state = parseState(core.getInput('state', { required: true }));
  const auto_inactive = core.getInput('auto_inactive', { required: true }) === 'true';
  const description = core.getInput('description');
  const environment = core.getInput('environment');
  const environment_url = core.getInput('environment_url');
  const log_url = core.getInput('log_url');

  const { owner, repo } = context.repo;
  const req = {
    owner,
    repo,

    deployment_id,
    state,
    auto_inactive,
  };

  if (description) {
    req['description'] = description;
  }
  if (environment) {
    req['environment'] = environment;
  }
  if (environment_url) {
    req['environment_url'] = environment_url;
  }
  if (log_url) {
    req['log_url'] = log_url;
  }

  const github = new GitHub(
    process.env.GITHUB_TOKEN,
    { previews: ["ant-man-preview", "flash-preview"]});

  core.debug(JSON.stringify(req));
  const resp = await github.repos.createDeploymentStatus(req);
  core.debug(JSON.stringify(resp));

  core.setOutput('deployment_status_id', resp.data.id.toString());
  core.setOutput('deployment_status_url', resp.data.url);
}

main().catch(function(error) {
  core.setFailed(error.message);
});
