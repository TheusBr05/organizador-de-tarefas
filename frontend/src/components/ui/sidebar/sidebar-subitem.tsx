import { Link } from 'react-router-dom'
import styles from './sidebar-subitem.module.scss'
import clsx from 'clsx'

export type SidebarSubitemProps = {
  name: string
  path: string
  expanded: boolean
}

export function SidebarSubitem(props: SidebarSubitemProps) {
  const { name, path, expanded } = props

  return (
    <Link to={path} className={clsx(styles['subitem'],
      { [styles['collapsed']]: !expanded }
    )} >
      <p className={styles['text-subitem']}>
        {name}
      </p>
    </Link>
  )
}
