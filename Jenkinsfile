def notify = [
    email: false,
    slack: [ success: '#ima-build-success', failure: '#ima-build-failed' ]
]

def checkmarxBranchId = '3973'
def checkmarxScanCredentialId = 'sys_aimsengr'

def proxyEnvVars = [
    'http_proxy=http://proxy-chain.intel.com:911',
    'https_proxy=http://proxy-chain.intel.com:912'
]

def _projectKey = 'management-console-ui'
def _skipInfra = false

def doNotSkipAnalysisBranchName = 'develop'

node {
    try {
        stage('Cloning Repository') {
            scmCheckout {
                clean = true
            }
        }

        stage('Tests') {
            docker.image('amr-registry.caas.intel.com/rrp-devops/nodejs-build-agent:10.1-slim').inside {
                withEnv(proxyEnvVars) {
                    sh 'npm install -g npm@5.6.0 && npm install --verbose && npm run postinstall && npm run test-ci'
                }
            }

            junit testResults: 'TESTS-*.xml', allowEmptyResults: true
        }

        stage('Build') {
            docker.image('amr-registry.caas.intel.com/rrp-devops/nodejs-build-agent:10.1-slim').inside {
                withEnv(proxyEnvVars) {
                    sh 'npm run postinstall && npm run build'
                }
            }

            junit testResults: 'TESTS-*.xml', allowEmptyResults: true
        }

        //only run static code analysis on master branch
        if(env.GIT_BRANCH == doNotSkipAnalysisBranchName) {
            stage('SonarQube Scan') {
                sonarQubeScan {
                    projectKey = 'management-console-ui'
                    projectName = 'Management Console UI'
                    scannerType = 'javascript'
                }
            }

            stage('Checkmarx Scan') {
                withCredentials([
                    usernamePassword(credentialsId: checkmarxScanCredentialId,
                                    passwordVariable: 'CXPASSWORD',
                                    usernameVariable: 'CXUSERNAME')
                ]) {
                    def u = "${env.CXUSERNAME}"
                    def p = "${env.CXPASSWORD}"
                    itCheckmarxScan {
                        branchId = checkmarxBranchId
                        username = u
                        password = p
                    }
                }
            }

            stage('Protex Scan') {
                build(
                    job: 'rrs-generic-protex-build',
                    parameters: [
                        string(name: 'PROTEX_GIT_REPO', value: scm.userRemoteConfigs.url[0]),
                        string(name: 'PROTEX_GIT_BRANCH', value: env.GIT_BRANCH.replaceAll('origin/', '')),
                        string(name: 'PROTEX_PROJECT_NAME', value: 'RSP-mgt_console_angular'),
                        string(name: 'PROTEX_SOURCE_PATH', value: '.')
                    ]
                )
            }
        }

        if(!_skipInfra) {
            //Check to see if there is any infratructure that needs to be created or updated
            stage('Cloud Infrastructure') {
                rrpCloudFormation {
                    projectKey = _projectKey
                    dockerImageName = _projectKey

                    useDevOpsManagedTemplate = 'ecr-repo-setup'
                    infra = [
                        stackName: 'RRS-Codepipeline-ManagementConsoleUI'
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
