import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Tag from '@widget/components/tag'
import Input from '@widget/components/input'
import style from './style.scss'
import SearchIcon from '@widget/assets/icons/search.svg'

@injectStore((stores) => ({
  extension: stores.extension.instance,
  dictionary: stores.dictionary,
}))
@observer
export default class Dictionary extends Component {
  static propTypes = {
    extension: PropTypes.object,
    dictionary: PropTypes.object.isRequired,
  }

  state = {
    /** @type {string[]} */
    tags: [],
  }

  componentDidMount() {
    /** @type {string} */
    const fieldValue = this.props.extension.field.getValue()

    fieldValue && this.setState({ tags: fieldValue.split('; ') })

    this.getDictionary(this.props.extension.field.id)
  }

  async getDictionary(id) {
    const dictionary = await this.props.dictionary.get(id)
    this.setState({ dictionary })
  }

  render() {
    const { tags } = this.state

    return (
      <>
        <div className={style.TagContainer}>
          {tags.map((item) =>
            /* eslint-disable-next-line no-console */
            <Tag key={item} removable onRemoveClick={(event) => console.log(event)}>{item}</Tag>
          )}
          {/* eslint-disable-next-line no-console */}
          <Tag add onAdd={(event) => console.log(event)} />
        </div>
        <Input icon={SearchIcon} placeholder='Искать термин' />
      </>
    )
  }
}
