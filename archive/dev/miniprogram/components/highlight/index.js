Component({
  externalClasses: [
    /** 自定义普通文本样式 */
    'general-class',
    /** 自定义高亮文本样式 */
    'highlight-class'
  ],

  properties: {
    /** 是否高亮 */
    highlightable: {
      type: Boolean,
      value: true
    },

    /** 高亮颜色 */
    highlightColor: {
      type: String,
      value: 'rgba(35, 155, 151, 1)'
    },

    /** 文本 */
    text: {
      type: String,
      value: ''
    },

    /**
     * 文本中需要高亮的关键词
     * @type { string | string[] }
     */
    keywords: {
      type: String,
      optionalTypes: [Array],
      value: ''
    },

    /**
     * 关键词匹配模式
     * - i: 忽略大小写
     * - g: 全局匹配
     */
    flags: {
      type: String,
      value: ''
    }
  },

  data: {
    /** 文本片段 */
    segments: []
  },

  observers: {
    'highlightable,text,keywords,flags'() {
      this.setSegments()
    }
  },

  methods: {
    /**
     * 是否有效字符串
     * @param {string} text 字符串
     * @returns {boolean}
     */
    isValidString(text) {
      return typeof text === 'string' && text.length > 0
    },

    /**
     * 解析flags配置
     * @param {string} flags - flags配置
     * @returns { {ignoreCase: boolean; global: boolean;} }
     */
    genMatchedFlags(flags) {
      const cases = {
        i: { ignoreCase: true, global: false },
        g: { ignoreCase: false, global: true },
        ig: { ignoreCase: true, global: true },
        gi: { ignoreCase: true, global: true },
        default: { ignoreCase: false, global: false }
      }
      const key = this.isValidString(flags) ? flags.trim() : ''
      return cases[key] || cases.default
    },

    /**
     * 格式化 keywords
     * @param {string | string[]} keywords
     * @returns {string[]}
     */
    formatKeywords(keywords) {
      if (this.isValidString(keywords)) {
        return [keywords]
      }
      if (Array.isArray(keywords)) {
        return [...new Set(keywords.filter(this.isValidString.bind(this)))]
      }
      return []
    },

    /**
     * 根据是否区分大小写格式化文本
     * @template {string} T
     * @param {T} text        - 文本
     * @param {boolean} ignoreCase - 忽略大小写
     * @returns {T}
     */
    formatMatchText(text, ignoreCase) {
      if (!ignoreCase) {
        return text
      }
      if (Array.isArray(text)) {
        return text.map(item => item.toLowerCase())
      }
      return text.toLowerCase()
    },

    /**
     * 生成文本片段
     * @param {string} text       - 完整文本
     * @param {string[]} keywords - 关键词列表
     * @returns {Array<{text: string; highlight: boolean;}>}
     */
    genSegments(text, keywords) {
      if (!this.isValidString(text)) {
        return []
      }

      if (!this.properties.highlightable || !keywords.length) {
        return [{ text, highlight: false }]
      }

      const flags = this.genMatchedFlags(this.properties.flags)
      const formattedText = this.formatMatchText(text, flags.ignoreCase)
      const formattedKeywords = this.formatMatchText(
        this.formatKeywords(keywords),
        flags.ignoreCase
      )
      const matchedKeywords = new Set()
      const segments = []

      const sliceText = (start = 0, end = text.length, highlight = false) => {
        return { text: text.slice(start, end), highlight }
      }

      // 获取下一处匹配的位置和关键词
      const getMatched = fromIndex => {
        let index = -1
        let matched = ''
        for (let i = 0; i < formattedKeywords.length; i++) {
          const keyword = formattedKeywords[i]
          if (!flags.global && matchedKeywords.has(keyword)) {
            continue
          }
          const nextIndex = formattedText.indexOf(keyword, fromIndex)
          if (nextIndex === -1) {
            continue
          }
          if (index === -1 || nextIndex < index) {
            index = nextIndex
            matched = keyword
            matchedKeywords.add(keyword)
          }
        }
        return index < 0 ? null : { index, keyword: matched }
      }

      let fromIndex = 0
      let matched = getMatched(fromIndex)

      while (matched) {
        const { index, keyword } = matched
        fromIndex !== index && segments.push(sliceText(fromIndex, index, false))
        segments.push(sliceText(index, index + keyword.length, true))
        fromIndex = index + keyword.length
        matched = getMatched(fromIndex)
      }

      fromIndex < text.length && segments.push(sliceText(fromIndex))
      return segments
    },

    setSegments() {
      const { text, keywords } = this.properties
      const segments = this.genSegments(text, keywords)
      const highlightSegments = segments.filter(item => item.highlight)
      this.setData({ segments })
      this.triggerEvent('matched', highlightSegments)
    },

    onTapSegment(e) {
      const { index } = e.currentTarget.dataset
      const segments = this.data.segments
      const segment = segments[index]
      if (!segment || !segment.highlight) {
        return
      }
      const highlightSegments = segments.filter(item => item.highlight)
      const highlightIndex = highlightSegments.findIndex(
        item => item === segment
      )
      const { text: keyword } = segment
      // order 表示点击的是第几个关键词，从 1 开始
      const order = highlightIndex + 1
      this.triggerEvent('click-keyword', { order, keyword })
    }
  }
})
