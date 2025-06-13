import { cloneElement, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './sidebar-item.module.scss'
import clsx from 'clsx'
import { SidebarSubitem } from './sidebar-subitem'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export type SidebarItemProps = {
  icon: JSX.Element
  name: string
  path: string
  expanded: boolean
  subitems: {
    name: string
    path: string
    expanded: boolean
  }[] | undefined
}

export function SidebarItem(props: SidebarItemProps) {
  const { icon, name, path, expanded, subitems } = props
  const [expandedItem, setExpandedItem] = useState(false)

  return (
    <div className={clsx(styles['item'],
      { [styles['collapsed']]: !expanded }
    )}>
      <Link to={path} className={styles['main-item']} >
        {(!subitems || !expanded) &&
          <div className={styles['icon-div']}>
            {cloneElement(icon, { className: styles['icon-item'], size: 20 })}
          </div>
        }
        {expanded && subitems &&
          <div className={styles['icon-div']} onClick={(e) => {
            e.preventDefault()
            setExpandedItem(!expandedItem)
          }}>
            {expandedItem
              ? <FiChevronUp className={styles['icon-item']} size={20} />
              : <FiChevronDown className={styles['icon-item']} size={20} />
            }
          </div>
        }
        <p className={styles['text-item']}>
          {name}
        </p>
        <div className={styles['tooltip']}>
          <p className={styles['tooltip-text']}>
            {name}
          </p>
        </div>
      </Link>

      {expanded &&
        <div className={clsx(styles['subitems'],
          { [styles['collapsed']]: !expandedItem }
        )}>
          {subitems &&
            subitems.map((subitem, index) => (
              <SidebarSubitem
                key={index}
                name={subitem.name}
                path={subitem.path}
                expanded={subitem.expanded}
              />
            ))}
        </div>

      }

    </div>
  )
}
