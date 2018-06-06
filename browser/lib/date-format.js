import dateformat from 'dateformat'
import configManager from './config-manager'

export default function formatDate (date) {
  return dateformat(date, configManager.get('ui->dateFormat'))
}
