// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "avatarUrl": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "头像",
    "label": "头像"
  },
  "username": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "姓名",
    "title": "姓名"
  },
  "phone": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "pattern": "^\\+?[0-9-]{3,20}$"
      }
    ],
    "label": "手机号",
    "title": "手机号"
  },
  "gender": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "男",
            "value": 1
          },
          {
            "text": "女",
            "value": 2
          }
        ]
      }
    ],
    "title": "性别",
    "defaultValue": 1,
    "label": "性别"
  },
  "age": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "年龄",
    "title": "年龄"
  },
  "balance": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "余额",
    "title": "余额"
  },
  "merchantID": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "所属商家",
    "title": "所属商家",
    "defaultValue": "67723526fe975f6f96069a43"
  },
  "contactAddress": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "联系地址",
    "title": "联系地址"
  },
  "residentAddress": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "",
    "title": "常驻地址"
  },
  "latitude": {
    "rules": [
      {
        "format": "double"
      }
    ],
    "label": "纬度",
    "title": "纬度"
  },
  "longitude": {
    "rules": [
      {
        "format": "double"
      }
    ],
    "label": "经度",
    "title": "经度"
  },
  "level ": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "等级",
    "title": "等级"
  },
  "workPhoto": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "工作照",
    "label": "工作照"
  },
  "lifePhoto": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "生活照",
    "label": "生活照"
  },
  "IDFront": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "身份证正面",
    "label": "身份证正面"
  },
  "IDReverse": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "身份证反面",
    "label": "身份证反面"
  },
  "skillCertificate": {
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
    "title": "技能证书",
    "label": "技能证书"
  },
  "classType": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "所属分类",
    "title": "所属分类"
  },
  "auditStatus": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "审核中",
            "value": 1
          },
          {
            "text": "通过",
            "value": 2
          },
          {
            "text": "不通过",
            "value": 3
          }
        ]
      }
    ],
    "title": "审核状态",
    "defaultValue": 1,
    "label": "审核状态"
  },
  "isEnable": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "生效状态",
    "defaultValue": true,
    "label": "生效状态"
  }
}

const enumConverter = {
  "gender_valuetotext": {
    "1": "男",
    "2": "女"
  },
  "auditStatus_valuetotext": {
    "1": "审核中",
    "2": "通过",
    "3": "不通过"
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
