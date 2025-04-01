// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "eduInfoType": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "教育咨询类型"
  },
  "title": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "标题"
  },
  "contentsConsultation": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "内容"
  },
  "coverImage": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "封面图片"
  },
  "imageList": {
    "rules": [
      {
        "format": "array"
      },
      {
        "arrayType": "file"
      },
      {
        "maxLength": 10
      }
    ],
    "label": "内容图片"
  },
  "videoSrc": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "视频"
  },
  "dateTime": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "timestamp"
      }
    ],
    "label": "日期时间",
    "defaultValue": {
      "$env": "now"
    }
  },
  "isEnable": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "否",
            "value": 0
          },
          {
            "text": "是",
            "value": 1
          }
        ]
      }
    ],
    "label": "是否启用",
    "defaultValue": 1
  }
}

const enumConverter = {
  "isEnable_valuetotext": {
    "0": "否",
    "1": "是"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
