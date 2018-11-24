const fs = require('fs')
const path = require('path')

loadJSFile = require.extensions['.js']

const FANSERVICE_DIR = 'node_modules/@mishguru/fanservice/dist/topics'

const CODE_TO_INJECT_INTO_FANSERVICE_TOPICS = `
if (typeof constraints !== 'undefined') {
  module.exports.constraints = constraints
}
`

// hack to force fanservice to export constraints from topic files
require.extensions['.js'] = (mod, filename) => {
  const dirname = path.dirname(filename)

  if (dirname.includes(FANSERVICE_DIR)) {
    var content = fs.readFileSync(filename, 'utf8')
    content += CODE_TO_INJECT_INTO_FANSERVICE_TOPICS
    mod._compile(content, filename)
  } else {
    loadJSFile(mod, filename)
  }
}

const fanservice = require('@mishguru/fanservice')

const turbineTopics = fanservice.allTopics.map((topic) => {
  const { name, queues, constraints } = topic

  const schema = {
    name,
    type: 'object',
    properties: {}, 
    required: []
  }

  Object.keys(constraints).forEach((key) => {
    const constraint = constraints[key]
    if (constraint.presence === true) {
      schema.required.push(key)
    }
    switch (true) {
      case constraint.numericality:
        schema.properties[key] = { type: 'integer' }
        break
      default:
        schema.properties[key] = { type: 'string' }
        break
    }
  })

  return {
    name: topic.name,
    queues: topic.queues.map((q) => q.name),
    schema
  }
})

const turbineQueues = fanservice.allQueues.map((queue) => {
  return queue.name
})

const turbineConfig = {
  topics: turbineTopics,
  queues: turbineQueues
}

module.exports = turbineConfig
