import React from 'react'
import logo from 'resources/icon/icon512.png'
import { shell, remote } from 'electron'
import i18n from 'render/lib/i18n'
import Switch from 'render/components/switch'
import ConfigManager from 'lib/config-manager'
import { pageView } from 'lib/analytics'
import donateButton from 'resources/image/donate.png'

const { app } = remote

export default class About extends React.Component {
  componentDidMount () {
    const links = document.querySelectorAll('a')
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()
        shell.openExternal(link.href)
      })
    })
    pageView('/setting/about')
  }

  onAnalyticsChange (checked) {
    ConfigManager.set({ allowAnalytics: checked })
  }

  render () {
    const { config } = this.props
    return (
      <div className="about-tab">
        <h1 className="tab-title">{i18n.__('About')}</h1>
        <div className="content">
          <div className="inline">
            <img src={logo} width="200px" />
            <div className="m-l-100">
              <h2>SnippetStore</h2>
              <p>Version: {app.getVersion()}</p>
              <p className="m-t-20">
                {i18n.__('SnippetStore is a snippet management app developers')}
              </p>
            </div>
          </div>
          <h2 className="m-t-50">Author</h2>
          <p>
            Nguyen Viet Hung (
            <a href="https://github.com/ZeroX-DG">@ZeroX-DG</a>)
          </p>
          <p>Email: viethungax@gmail.com</p>
          <h2 className="m-t-50">Donate</h2>
          <p>
            {i18n.__(
              `If this app help you with your work and you wish to say thanks to me, you can donate me through Buy Me A Coffee. Your donation will be a huge motivation for me to continue to add more features and bugfixes in the future.`
            )}
            <br />
            <br />
            <a href="https://www.buymeacoffee.com/hQteV8A">
              <img src={donateButton} alt="Buy Me A Coffee" />
            </a>
          </p>
          <h2 className="m-t-50">Analytics</h2>
          <p>
            {i18n.__(
              'SnippetStore collects anonymous data for only 1 reason' +
                '-improve user experience. We will never collects your private ' +
                'information such as your code snippets. If you wish to know ' +
                'how it work, here is its source code:'
            )}
            &nbsp;
            <a href="https://github.com/ZeroX-DG/SnippetStore">github</a>
          </p>
          <p>
            <Switch
              onChange={checked => this.onAnalyticsChange(checked)}
              defaultValue={config.allowAnalytics}
            />
            Enable analytics to help improve SnippetStore
          </p>
        </div>
      </div>
    )
  }
}
