/*
小红书 Stash JSON Rewrite
用于替代 Surge [Body Rewrite] 里的 http-response-jq / response-body-json-jq
*/

const url = $request.url;
let body = $response.body;

try {
  if (!body) {
    $done({});
  }

  let obj = JSON.parse(body);

  if (/\/api\/sns\/v1\/search\/banner_list$/.test(url)) {
    if (Object.prototype.hasOwnProperty.call(obj, "data")) {
      obj.data = {};
    }
  }

  if (/\/api\/sns\/v1\/search\/hot_list$/.test(url)) {
    if (obj.data && Object.prototype.hasOwnProperty.call(obj.data, "items")) {
      obj.data.items = [];
    }
  }

  if (/\/api\/sns\/v4\/search\/hint/.test(url)) {
    if (obj.data && Object.prototype.hasOwnProperty.call(obj.data, "hint_words")) {
      obj.data.hint_words = [];
    }
  }

  if (/\/api\/sns\/v4\/search\/trending\?/.test(url)) {
    if (obj.data && Object.prototype.hasOwnProperty.call(obj.data, "queries")) {
      obj.data.queries = [];
    }

    if (obj.data && Object.prototype.hasOwnProperty.call(obj.data, "hint_word")) {
      obj.data.hint_word = {};
    }
  }

  // 搜同款：del(.data.image_press_result.anchor_detail)
  if (/\/api\/sns\/v1\/note\/longpress/.test(url)) {
    if (
      obj.data &&
      obj.data.image_press_result &&
      Object.prototype.hasOwnProperty.call(obj.data.image_press_result, "anchor_detail")
    ) {
      delete obj.data.image_press_result.anchor_detail;
    }
  }

  $done({
    body: JSON.stringify(obj)
  });
} catch (e) {
  console.log("xhs_json_rewrite error: " + e);
  $done({});
}
