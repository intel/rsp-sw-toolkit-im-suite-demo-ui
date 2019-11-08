def notify = [
    email: false,
    slack: [ success: '#ima-build-success', failure: '#ima-build-failed' ]
]

def proxyEnvVars = [
    'http_proxy=http://proxy-chain.intel.com:911',
    'https_proxy=http://proxy-chain.intel.com:912'
]

def _projectKey = 'edgex-demo-ui'
def _skipInfra = false

def doNotSkipAnalysisBranchName = 'master'

node {
    try {
        stage('Cloning Repository') {
            scmCheckout {
                clean = true
            }
        }

        stage('Tests') {
            withEnv(proxyEnvVars) {
                // this image has problems running as root, so we have to do some sudo shennanigans
                def buildImage = docker.build('edgex-demo-ui-builder:latest', '-f Dockerfile.build --build-arg http_proxy --build-arg https_proxy .')

                sh 'chown -R 1000:1000 .'

                buildImage.inside {
                    sh 'sudo -Eu chrome npm install'
                    sh 'sudo -Eu chrome ng test --codeCoverage=true --watch=false'
                }

                sh 'chown -R root:root .'
            }

            // archiveArtifacts allowEmptyArchive: true, artifacts: '**/coverage/*', caseSensitive: false, defaultExcludes: false, fingerprint: true
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'coverage/edgex-ui', reportFiles: 'index.html', reportName: 'Angular Coverage Report', reportTitles: ''])
        }

        //only run static code analysis on master branch
        if(env.GIT_BRANCH == doNotSkipAnalysisBranchName) {
            stage('Static Code Analysis') {
                staticCodeScan {
                    scanners             = ['checkmarx', 'protex']

                    // Protex
                    protexBuildName      = 'rrp-generic-protex-build'
                    protexProjectName    = 'bb-demo-ui'

                    //Checkmarx
                    checkmarxProjectName = 'RBHE-CodePipeline-EdgexDemoUI'
                }
            }
        }

        if(!_skipInfra) {
            //Check to see if there is any infrastructure that needs to be created or updated
            stage('Cloud Infrastructure') {
                rrpCloudFormation {
                    projectKey = _projectKey
                    dockerImageName = _projectKey

                    useDevOpsManagedTemplate = 'ecr-repo-setup'
                    infra = [
                        stackName: 'RBHE-CodePipeline-EdgexDemoUI'
                    ]
                }
            }
        }

        withEnv(proxyEnvVars) {
            dockerBuild {
                dockerImageName         = _projectKey
                dockerRegistry          = 'amr-registry.caas.intel.com/rrs'
                ecrRegistry             = '280211473891.dkr.ecr.us-west-2.amazonaws.com'
                pushLatestOn            = doNotSkipAnalysisBranchName
            }
        }

        if(notify.email) {
            def buildResult = currentBuild.result ?: 'SUCCESS'
            mail to: notify.email.to, subject: "[${buildResult}] 🙌 ✅ - ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} 🙌 ✅", body: "${env.BUILD_URL}"
        }

        if(notify.slack) {
            slackBuildNotify {
                slackSuccessChannel = notify.slack.success
            }
        }
    } catch (ex) {
        currentBuild.result = 'FAILURE'

        if(notify.email) {
            mail to: notify.email.to, subject: "[${currentBuild.result}] 💩 😵 - ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} 👻 😭", body: "${env.BUILD_URL}"
        }

        if(notify.slack) {
            slackBuildNotify {
                failed = true
                slackFailureChannel = notify.slack.failure
                messages = [
                    [ title: 'An Error Occured', text: "The build failed due to: ${ex.getMessage()}" ]
                ]
            }
        }

        throw ex
    }
}
