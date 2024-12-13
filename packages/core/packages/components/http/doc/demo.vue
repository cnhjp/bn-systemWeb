<template>
  <p>123</p>
</template>

<script>
import {HttpLibrary} from '../src/http'

const url = 'http://standard.gateway.hz.com/user/pb/m/v1/token/login/password'

class Request extends HttpLibrary {
  onResponseFulfilled(response) {
    debugger
    return super.onResponseFulfilled(response).then(response => {
      debugger
    })
  }
}

const request = new Request()

export default {
  name: 'demo',
  created() {
    request.get(url, {}).then(response => {
      debugger
    })
  }
}
</script>

<style scoped>

</style>