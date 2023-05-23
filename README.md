# GitHub Action &ndash; Set GitHub deployment status

Update the status of a deployment in your repo. Use in your
workflows that react to the [deployment event][1].

  [1]: https://help.github.com/en/actions/reference/events-that-trigger-workflows#deployment-event-deployment

## Usage

Create a new deployment, either from your tooling or from another
workflow (using [avakar/create-deployment][2], for example).
Then include this action in your deployment workflow.

    on: deploy
    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - uses: avakar/set-deployment-status@v1
            with:
              state: in_progress
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          - run: |
            echo 'Performing the deployment...'
            sleep 10
          - uses: avakar/set-deployment-status@v1
            with:
              state: success
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          - uses: avakar/set-deployment-status@v1
            if: failure()
            with:
              state: failure
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  [2]: https://github.com/avakar/create-deployment

Petition GitHub to allow success/failure context functions outside
of the `if` entry and then you'll be able to replace the last
two steps with the following.

          - uses: avakar/set-deployment-status@v1
            if: always()
            with:
              state: ${{ success() }}
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

Or, better yet, let actions retrieve the status on their own and then
we can do the final update as a post-action.

### Inputs

See the [Developer API][3] documentation for an explanation of the
input parameters. Both `ant-man` and `flash` previews are enabled.

  [3]: https://developer.github.com/v3/repos/deployments/#create-a-deployment-status

* `state`: required, one of `error`, `failure`, `inactive`,
  `in_progress`, `queued`, `pending`, or `success`.
* `deployment_id`: defaults to `github.event.deployment.id`;
  you don't have to specify it if you're being triggered by
  the "deployment" event.
* `auto_inactive`: defaults to `true`
* `description`
* `environment_url`
* `log_url`
* `owner`: defaults to the current repository's owner
* `repo`: defaults to the current repository

### Outputs

* `deployment_status_id`: the numeric ID of the new deployment status
* `deployment_status_url`: the API url of the new deployment status
