# å‘½ä»¤è¦†ç›–ä¸Žåœºæ™¯æ‰§è¡Œé…æ–¹

å…ˆæ‰§è¡Œå€™é€‰ç‰ˆæœ¬å¸®åŠ©å‘çŽ°ï¼ˆå«éšè—çš„å®žéªŒå‘½ä»¤æ ‘ `bsk recipe`ï¼‰ï¼Œè¯»å½“å‰ `browser-agent` å¯¹åº” reference åŠ `docs/recipes.md`ã€‚ä»¥ä¸‹æ˜¯æ“ä½œ/éªŒæ”¶é…æ–¹ï¼Œä¸æ˜¯å¯è„±ç¦»å½“å‰å¸®åŠ©ç›´æŽ¥å¤åˆ¶çš„å‚æ•°è¡¨ã€‚æ¯ä¸ªå¶å‘½ä»¤/æžšä¸¾ action éƒ½ç”Ÿæˆç‹¬ç«‹ `CMD-*`ï¼›ç‰ˆæœ¬æ–°å¢žå‘½ä»¤åŒæ ·å¿…æµ‹ã€‚

## è¦†ç›–å®šä¹‰ä¸Ž Benchmark å£å¾„

å››ä¸ªç»´åº¦åˆ†åˆ«æŠ¥å‘Šï¼š**åŠ¨æ€å‘½ä»¤æ¸…å•ã€å›ºå®šåœºæ™¯æ¸…å•ï¼ˆ113 é¡¹ï¼Œå« 21 é¡¹å¯¹æŠ—é¶åœºåœºæ™¯ `ARENA-*`ï¼‰ã€ç½‘é¡µç±»åž‹æ¸…å•ã€Benchmark æ•ˆçŽ‡ä¸Žè€—æ—¶æŒ‡æ ‡**ã€‚å‘½ä»¤è‡³å°‘æœ‰ä¸€æ¬¡é€‚ç”¨çŽ¯å¢ƒçš„å®žé™…æˆåŠŸè°ƒç”¨ä¸”ä¸šåŠ¡éªŒæ”¶é€šè¿‡ï¼›åœºæ™¯éœ€å®Œæˆå…¶å…¨éƒ¨åŠ¨ä½œä¸Žå˜ä½“ã€‚CLI é€€å‡º 0ã€HTTP 200ã€æˆªå›¾æ–‡ä»¶å­˜åœ¨ã€å¸®åŠ©èƒ½æ˜¾ç¤ºï¼Œå‡ä¸ç­‰äºŽä¸šåŠ¡é€šè¿‡ã€‚

ç½‘é¡µç±»åž‹Ã—å‘½ä»¤è¡¨è®°å½•å®žé™…ç”¨åˆ°çš„å‘½ä»¤åŠè¯æ®ã€‚æ— è¯­ä¹‰ç»„åˆï¼ˆå¦‚ Canvas å†…æ—  selectï¼‰å†™æ¸…åŽŸå› ï¼›ä¸èƒ½ç”¨ N/A åˆ é™¤å¿…æµ‹è¡Œã€‚`lifecycle` / `admin` / `mcp` / `batch-plan` / `recipe` å•ç‹¬åˆ—èƒ½åŠ›åŸŸï¼Œè¡¨ä¸­çš„æ¯ä¸€ç±»ç½‘é¡µéƒ½è¦æœ‰å®žæµ‹åœºæ™¯ã€‚

Benchmark è‡ªåŠ¨é‡‡é›†æ¯æ¬¡å‘½ä»¤çš„**äº¤äº’è½®æ¬¡ï¼ˆ`interaction_turns`ï¼‰ã€å®žé™…æ‰§è¡ŒåŠ¨ä½œæ•°ï¼ˆ`actions_executed`ï¼‰ã€è½®æ¬¡åŽ‹ç¼©æ¯”ï¼ˆ`actions/turn`ï¼‰ã€RPC/æµè§ˆå™¨è°ƒç”¨æ•°ã€å¢™é’Ÿè€—æ—¶ï¼ˆ`elapsed_ms`ï¼‰ä¸Žè§‚å¯Ÿå¤ç”¨æƒ…å†µ**ã€‚

## æ‰€æœ‰å‘½ä»¤æ—

| å‘½ä»¤ | é€‚ç”¨é¡µ/æ‰§è¡Œä¸ŽéªŒæ”¶ |
| --- | --- |
| status / doctor / browsers / logs / help | çŽ¯å¢ƒå’Œéš”ç¦» adminï¼šæ ¸å¯¹è¿žæŽ¥/ç‰ˆæœ¬/åè®®ã€doctor é—®é¢˜æç¤ºã€å¯è¯»æ—¥å¿—ï¼›`help` æœ¬èº«å®žé™…æ‰§è¡Œç®—æ­¤å‘½ä»¤ï¼Œå…¶ä»–å‘½ä»¤çš„ `--help` ä¸ç®—è¦†ç›– |
| session start/list/request/stop | æ˜Žç¡® browserï¼Œä¸¤ä¸ªç‹¬ç«‹ session éš”ç¦»ï¼›æƒé™ request æŒ‰å½“å‰å¸®åŠ©çœŸæ­£è¯·æ±‚ï¼›stop åŽä¸å­˜åœ¨æœ¬è½®æ´» sessionï¼Œä¸åœæ­¢åˆ«äºº |
| tab list/create/select/close/borrow/return | ä¸¤ä¸ªä»»åŠ¡é¡µäº’åˆ‡ã€å…³é—­è‡ªå»ºé¡µï¼›å€Ÿç”¨ä¸“ç”¨æ™®é€šé¡µâ†’æ“ä½œâ†’å½’è¿˜ï¼Œæ ¸å¯¹çª—å£/URL/çŠ¶æ€ï¼Œå®žé™…ç”¨æˆ·ç¡®è®¤ä¸å¯è·³è¿‡ |
| window resize / emulate | ä¸¤ä¸ªå°ºå¯¸ä¸Žä¸€ä¸ªç§»åŠ¨è®¾å¤‡/è‡ªå®šä¹‰æ¨¡å¼ï¼ŒBsk evaluate/read åªè¯»æ ¸å¯¹ UA/viewport/DPR/touchï¼Œæ¢å¤æœ¬è½®é¡µ |
| cooperate enable/status/sync/wait | target ä¸Ž strict ç‹¬ç«‹ä¼šè¯ï¼ŒçŠ¶æ€/receipt/ç­‰å¾…ä¸é”è¾“å…¥é˜Ÿåˆ—ï¼›`sync --save-full` / `--baseline` / `--match-text` è·¯å¾„å®žæµ‹å¹¶æ ¸å¯¹æœªä¸¢ä¸šåŠ¡è¯­ä¹‰ |
| step / view | ä¸€æ¬¡åŠ¨ä½œ+çœŸå®ž readiness æ¡ä»¶ï¼ˆ`--until-visible`ï¼‰ï¼Œç¡®è®¤ action åªå‘ç”Ÿä¸€æ¬¡ï¼›`view` è¯»å–ä¿å­˜çš„ sync/step/plan æ–‡ä»¶ï¼Œé›¶æµè§ˆå™¨è°ƒç”¨ï¼ˆ`browser_calls:0`ï¼‰ä¸”ä¸åˆ·æ–° ref |
| **plan** | target ç­–ç•¥ä¸‹ä¸€æ¬¡ sync åŽæ‰¹é‡æ‰§è¡Œ 1â€“20 ä¸ªå·²å†³å®šæ­¥éª¤ï¼ˆ`click`ã€`fill`ã€`select`ã€`press`ã€`hover`ã€`scroll-to`ã€`wheel`ã€`drag`ã€`wait-for-element`ï¼‰ï¼Œæ”¯æŒæ­¥éª¤çº§ `expect`ã€é¦–æ­¥æ— ç›®æ ‡åŠ¨ä½œï¼ˆéœ€ `--observation`ï¼‰ã€`--until-visible`ã€`--save-full`ã€`--baseline`ã€‚éªŒè¯æ­£ä¾‹ `ok:true` ä¸Ž `completed==total`ï¼›éªŒè¯è´Ÿä¾‹é¦–é”™å³åœï¼ˆ`stopped.index`ã€`stopped.effect_state`ã€`not_run`ï¼‰ä¸”ç»ä¸è‡ªåŠ¨é‡è¯• |
| **recipe list/show/rm/save/approve/draft/run** | é»˜è®¤å¼€å¯ `BSK_RECIPES=1`ã€‚åœ¨çœŸå®žä¼šè¯æ“ä½œ `/recipe/form?source=first` åŽç”¨ `recipe draft` å¯¼å‡ºè„±æ•è‰ç¨¿ï¼ˆéªŒè¯ `site.start` ä¸º `/recipe/form`ã€ä¸å«è¾“å…¥æ˜Žæ–‡ä¸Ž query secretï¼‰ï¼Œå®¡æŸ¥è¡¥é½ `until`/`outputs` åŽ `recipe save`ã€`recipe approve`ï¼ˆæ— é™çº§æ­¥éª¤è¿”å›ž `approval_required:false`ï¼‰ã€`recipe list`ã€`recipe show`ï¼›ç”¨ `recipe run` éªŒè¯è‰¯æ€§æ¼‚ç§»ï¼ˆ`ids/order/late/popup/rerender`ï¼‰ä¸‹çš„é›¶æ¨¡åž‹è½®æ¬¡å›žæ”¾ä¸Žå¤š `segments` è·¨é¡µæ‰§è¡Œï¼›éªŒè¯è¯­ä¹‰æ¼‚ç§»ä¸‹å®‰å…¨ `handoff`ï¼ˆè¿žç»­ 3 æ¬¡åŒä½åç¦»æ ‡ä¸º `stale`ï¼‰åŠä¸å¯é€† `commit` æ­¥éª¤ã€æœªäººå·¥å®¡æ‰¹é™çº§æ­¥éª¤ï¼ˆ`approval_required` / `approval_needs_person`ï¼‰ã€éžæ³•å‚æ•°ã€`borrowed_tab` çš„ `refused` æ‹’æ­¢ |
| **read** | é›¶ JS æ³¨å…¥çš„æœ‰ç•Œ DOM è¯»å–ï¼šåœ¨é™æ€é¡µã€é«˜é¢‘æ›´æ–°é¡µï¼ˆ`/live-update`ï¼‰ã€è§†é¢‘ç«™ï¼ˆ`/video-portal`ã€Bilibiliï¼‰ã€è®ºå›ç«™ï¼ˆ`/forum-hub`ã€V2EXï¼‰åŠ iframe/shadow èŠ‚ç‚¹ä¸Šï¼Œåˆ†åˆ«ç”¨ `--selector` ä¸Ž `--ref`ã€`--fields-json`ï¼ˆ`text`ã€`attribute`ã€`value`ã€`checked`ã€`exists`ï¼‰åŠ `--max-nodes` / `--max-bytes` å®žæµ‹ |
| navigate / navigate back/forward / navigate-back / navigate-forward / reload | æœ¬åœ°åŽŸç”Ÿé“¾æŽ¥ã€pushState SPA å’Œå…¬ç½‘ç«™ç‚¹ï¼›å·²æœ‰é¡µé¢å¯¼èˆª/åŽ†å²/reload æŒ‰å½“å‰åˆåŒæºå¸¦ context ä¸Žé¡¶å±‚ observationï¼›åŽ†å²ä¸¤æ­¥å‡æ ¡éªŒæœ€ç»ˆ URL/æ­£æ–‡ |
| snapshot / observe / get-html | è¡¨å•ã€é•¿åˆ—è¡¨ã€iframeã€Shadowã€Canvas/closed-root è¾¹ç•Œï¼Œæ£€æŸ¥è¯­ä¹‰ã€å›¾å±‚ `@layers` å’Œ sourceï¼›å…¨é¡µåŠå…ƒç´  HTML å„éªŒä¸€æ¬¡ |
| extract discover/table/list | è¡¨æ ¼/å¡ç‰‡/åˆ†é¡µ/è·¨æº frame/è§†é¢‘æŽ¨èå¡ç‰‡/è®ºå›ä¸»é¢˜åˆ—è¡¨ï¼Œæ ¸å¯¹åˆ—ã€è¡Œã€å…³è”ã€ç¼ºçœå­—æ®µä¸ä¸²åˆ—å’Œ provenance |
| click / hover / focus / blur / press | ref+CSSã€ä¸­æ–‡å¿«æ·é”®ã€èœå•ã€ç„¦ç‚¹äº‹ä»¶ã€åŽŸç”Ÿå¯¼èˆªã€å³ä¸‹è§’ CTAï¼›click æˆåŠŸè¦ä¸šåŠ¡ handler/URL æ­£ç¡® |
| fill / select | input/textarea/contenteditable æ ¹èŠ‚ç‚¹ã€æ¸…ç©º `""`ã€è¿½åŠ  `--no-clear`ã€æ—¥æœŸ5åž‹ã€å•/å¤šé€‰ï¼›ç¦ç”¨/åªè¯»/maxlength ä¸Žç¼–è¾‘å™¨å­èŠ‚ç‚¹æ‹’ç»ï¼ˆ`target_not_fillable`ï¼‰è¯­ä¹‰å•åˆ—ï¼›ä¸èƒ½ç”¨ evaluate ä»£å¡« |
| drag | workbench æ‹–åŠ¨æŽ§ä»¶ï¼što ç›®æ ‡ã€dx/dy ä½ç§»ã€æ”¯æŒçš„ click-move-click åˆ†åˆ«ç”¨åŒ¹é…æŽ§ä»¶ï¼›çœ‹çœŸå®žä½ç½®/å€¼/èŒƒå›´ |
| wheel / scroll-to | æ­£å/æ¨ªå‘/nested/é•¿é¡µ/iframe/åŠ¨æ€é¡µï¼ŒscrollTop/Left å’Œ viewport åæ ‡å®žæµ‹ |
| screenshot | viewport/full-page/element/canvasï¼›çœ‹å›¾æ ¸å¯¹å†…å®¹ã€å°ºå¯¸ã€è£å‰ªã€‚é•¿é¡µã€æ»šåŠ¨åŽã€resize åŽã€è§†é¢‘æ’­æ”¾é¡µå‡å«æ ·æœ¬ |
| evaluate | é™æ€é¡µã€SPAã€iframe å¯è¾¾èŒƒå›´ä¸Ž local/Ocean/Taobao active carouselã€Bilibili `<video>` çŠ¶æ€ï¼›æ ¸å¯¹å†…éƒ¨ `ok:true` ä¸ŽçœŸå®žå€¼ï¼Œfresh context/observation å¿…é¡»åŒ¹é… |
| wait-for-navigation / wait-for-element / wait-ms | å·²çŸ¥åŠ è½½ä¿¡å·ã€èŠ‚ç‚¹æ›¿æ¢ visible/hidden/attached/detachedï¼›missing selector ä¸ºé¢„æœŸè´Ÿä¾‹ï¼Œ`satisfied:false` ä¸å¾—ç®—æ­£ä¾‹ |
| upload / download | file inputã€hidden triggerã€dropã€å¤šæ–‡ä»¶/ä¸­æ–‡/ç©ºæ–‡ä»¶ï¼›ä¸‹è½½æ–°æ–‡ä»¶ sha256/åç§°/äº‹ä»¶ï¼›è¾“å‡ºå·²å­˜åœ¨ã€æ— æ•ˆè·¯å¾„åšè´Ÿä¾‹ |
| console / network | fixture console å¯¹è±¡ã€500 æ¶ˆè´¹/æœªæ¶ˆè´¹ã€æˆåŠŸå’Œå¤±è´¥è¯·æ±‚ï¼›æ ¸å¯¹å†…å®¹/åˆ†é¡µ/æ¥æºï¼Œä¸ä¿®æ”¹å…¬ç½‘ç½‘ç»œ |
| debug start/status/stop/capabilities | å¯¼èˆªå‰å¼€å¯ï¼ŒéªŒè¯ç”Ÿå‘½å‘¨æœŸã€buildã€stop/export æ€»é‡ï¼›éžç©ºåˆ—è¡¨ä¸ç­‰äºŽå…¨éƒ¨æ•èŽ· |
| debug requests/request/pages/console | metadata/request/response/headers/timingã€body pointerã€å­—ç¬¦åˆ†é¡µã€redactionã€URL/çŠ¶æ€ç­›é€‰ï¼›ä¸Žå—æŽ§ fixture å¯¹ç…§ |
| debug performance/aggregate/duplicates | slow threshold ä¸Žé‡å¤çª—å£è¾¹ç•Œï¼Œcontrolled é»˜è®¤æŽ’é™¤/åŒ…å«ï¼›æ ¸å¯¹æ•°å€¼å’Œ identity |
| debug operations/operation/activity/wait/pin/unpin | çœŸæ­£ command/request IDï¼Œç­‰å¾…åŽŸå‘½ä»¤ä¸é‡å‘ï¼Œpin/unpin çŠ¶æ€æ­£ç¡®ï¼›ä¸Šä¼ ä¸‹è½½æ¥æºä¸èƒ½è¯¯æ ‡ human |
| debug rules/rule_add/rule_enable/rule_disable/rule_remove/replay | ä»…æœ¬åœ° synthetic è¯·æ±‚ï¼Œone-match ç”Ÿæ•ˆ/ç¦ç”¨/å¯ç”¨/ç§»é™¤ï¼›åŒ replay key ä¸é‡å¤å‘é€ï¼›ä¸é‡æ”¾å…¬ç½‘å†™æ“ä½œ |
| debug export | æ–°è·¯å¾„è¾“å‡ºï¼Œåˆ†é¡µæ”¶é½åŽä¸Žå¯¼å‡ºåŠ stop çš„æ€»é‡å¯¹ç…§ï¼›260 burst ä¸èƒ½æˆªæˆ 200ï¼›å¤æŸ¥å®Œæ•´ JSON |
| dialog status/accept/dismiss / operation await/cancel | `/dialogs` alert/confirm/prompt/delayed alert/beforeunloadï¼›å¤„ç†åŽŸ operationï¼Œä¸é‡å¤ clickï¼›ä¸¤æ”¯è¿”å›ž/å–æ¶ˆè¯­ä¹‰å’Œ once è®¡æ•° |
| record start/stop / request-help | çœŸæ­£äººç±»åä½œï¼Œtrace çš„ç›®æ ‡/é¡ºåº/æ–‡æœ¬æ­£ç¡®ï¼›Agent è‡ªèº«ç‚¹å‡»ä¸èƒ½ç”¨æ¥è¯æ˜Žç”¨æˆ·å½•åˆ¶åŠŸèƒ½æ­£å¸¸ |
| video start/status/stop/list/save/discard | æ–°å½•åˆ¶â†’MP4 ç»“æž„/è§£ç â†’Bsk çœŸå®žæ’­æ”¾æ–°æ–‡ä»¶ï¼›ç‹¬ç«‹ discardï¼›baseline å¯æ’­æ”¾ä¸ä»£æ›¿æ–°å½•åˆ¶å¯æ’­æ”¾ |
| daemon start/restart/stop/pair/devices/revoke | åŒå€™é€‰ raw binaryã€ç‹¬ç«‹ admin-runtime/ç«¯å£ï¼Œä¸´æ—¶ server/é…å¯¹/æ’¤é”€ï¼Œæ ¸å¯¹æ’¤é”€åŽæ‹’ç»ï¼›ä¸é‡å¯ç”¨æˆ·å…±äº« runtime |
| update / install-skill | é»˜è®¤å®žæµ‹ `--check` / `--list`ï¼›æ£€æŸ¥è¾“å‡ºæ­£ç¡®ä¸”ä¸åŠ¨å€™é€‰ã€‚ä»…è¦†ç›–è¿™ä¸¤ä¸ªå®‰å…¨æ¨¡å¼ï¼ŒæŠ¥å‘Šç²¾ç¡®è¯´æ˜Žè¾¹ç•Œ |
| mcp | åŒå€™é€‰ `bsk mcp` stdioï¼Œ`initialize` / `tools/list`ï¼Œ**æ¯ä¸ª advertised toolï¼ˆå«å¼€å¯ `BSK_RECIPES=1` æ—¶çš„ `bsk_recipe`ï¼‰åŠå…¶ action/mode æžšä¸¾åˆ†æ”¯**æŒ‰ schema å®žæµ‹æˆåŠŸè°ƒç”¨ä¸Žé”™è¯¯/å–æ¶ˆå¯¹ç­‰æ€§ |

## åˆæˆé¡µé¢ä¸Žä¸šåŠ¡ oracle

æ¯ç§’å˜åŒ–é¡µå’Œæ´»åŠ¨è½®æ’­é¡µçš„ `evaluate` / `read` / `wheel` é…å¯¹æµ‹è¯•è§ [dynamic-pages.md](dynamic-pages.md)ã€‚

| é¡µé¢ | é‡ç‚¹ |
| --- | --- |
| `/workbench.html` | SPAã€å¤šæ­¥è¡¨å•/å¯Œæ–‡æœ¬ç¼–è¾‘å™¨ã€æŽ§ä»¶ã€iframe/open shadowã€è¡¨æ ¼åˆ—è¡¨ã€æ–‡ä»¶ã€è°ƒè¯•ã€é•¿é¡µ |
| `/plan-recipe-lab` (`/recipe/report`, `/recipe/form`, `/recipe/login`) | `bsk plan` çº§è”å¼‚æ­¥è¡¨å•ã€å•ä»·æ¶¨ä»· `expect` ä¸­æ­¢ã€äººå·¥å¹²é¢„ï¼Œä»¥åŠ `bsk recipe` å…¨ç”Ÿå‘½å‘¨æœŸä¸Ž 13 ç§æ¼‚ç§»/æ‹’æ­¢çŸ©é˜µ |
| `/video-portal` | æœ¬åœ°ç¡®å®šæ€§è§†é¢‘é—¨æˆ·ï¼šHTML5 `<video>` æŽ§åˆ¶æ ï¼ˆå€é€Ÿ/å¼¹å¹•/ç« èŠ‚/ç®€ä»‹ï¼‰ã€åŒå±‚å åŠ å¼¹çª—ï¼ˆ`modal=1` / `modal=2`ï¼‰ã€æŽ¨èæµä¸Žå¼‚æ­¥è¯„è®ºåŠ è½½ |
| `/forum-hub` | æœ¬åœ°ç¡®å®šæ€§å¼€å‘è€…è®ºå›ï¼šèŠ‚ç‚¹ Tab `pushState` åˆ‡æ¢ã€çƒ­åº¦/å…³é”®è¯ç­›é€‰ã€ç½®é¡¶å¸–ä¸Žé›¶å›žå¤å¸–å¯¹é½ã€å¸–å­è¯¦æƒ…æ¥¼å±‚ä¸Žä»£ç å—è¯»å–ã€è™šæ‹Ÿåˆ—è¡¨è§†å£è¡Œå›žæ”¶ï¼ˆRows 20-25ï¼‰ |
| `/minimal` | ç®€å•é™æ€é¡µé¢/è¡¨å•/SPA/è¡¨æ ¼ï¼Œç”¨ä½œä¸å—å¤æ‚å¸ƒå±€å¹²æ‰°çš„å¯¹ç…§ |
| `/nested-menu` | Element Plus é£Žæ ¼ä¸¤çº§åŠ¨æ€æ‚¬åœèœå•ï¼ˆ`Workspace -> Advanced`ï¼‰ï¼šä¸€çº§æµ®å±‚ teleport åˆ° `body`ï¼ŒäºŒçº§æµ®å±‚åµŒåœ¨çˆ¶ `menuitem` å†…ï¼ŒéªŒè¯å±•å¼€å‰åŽå­é¡¹ `@eN` ç‹¬ç«‹å¼•ç”¨ä¸Žç‚¹å‡»å›žæ‰§ `Selected audit` |
| `/edgecases` | maxlength/readonly/disabledã€ç›®æ ‡æ›¿æ¢ã€row42â†’99 å¤ç”¨ã€é‡å¤ CTAã€é®æŒ¡ã€closed shadowã€500 body |
| `/extra` | äº”ç§æ—¶é—´ã€focus/blurã€ç­‰å¾…èŠ‚ç‚¹æ›¿æ¢ã€äºŒç»´æ»šåŠ¨ã€å­ frame åˆ·æ–°ã€hidden æ–‡ä»¶ã€260 è¯·æ±‚ã€once è®¡æ•° |
| `/pointer-semantic` | Lit comments/style æ±¡æŸ“ã€å›ºå®šå·¦å³ä¸‹è§’ CTAã€åŽŸç”Ÿå¯¼èˆª |
| `/canvas-test` | åŒ Canvas ç»¿è‰²ç›®æ ‡è§†è§‰å®šä½/åæ ‡åŠ¨ä½œåŠå½•åˆ¶æº |
| `/media` / `/new-media` | baseline è§†é¢‘ä¸Žæœ¬è½®æ–°å½•åˆ¶æ’­æ”¾ã€åŽŸç”Ÿ controlsã€åª’ä½“çŠ¶æ€ |
| `/carousel` | 400ms çœŸå®ž DOM/å›¾ç‰‡è½®æ’­ä¸Žç¨³å®šè¡¨å•ï¼Œactive ä¸Ž paused æŽ§åˆ¶ç»„åˆ†å¼€ |
| `/live-update` | æ¯ 1000ms æ›´æ–° tick/æ—¶é—´/ä»·æ ¼ï¼Œé•¿é¡µä¸Ž nested åŒå‘æ»šåŠ¨ï¼Œ`evaluate` / `read` / `wheel` ç‹¬ç«‹å¿…æµ‹ |
| `/dialogs` | alert/confirm/prompt/delayed alert/beforeunloadï¼›arm é¡»ç”±çœŸå®ž Bsk ç‚¹å‡»æ¿€æ´» |
| `/frame` | åŒ/è·¨æº frame è¾“å…¥ä¿å­˜ã€frame è¡¨æ ¼ï¼Œhost/value äº‹ä»¶ |
| **`/arena-joint-forms`** | ä¸‰è¡¨è”åŠ¨è”åˆç”³æŠ¥ï¼ˆ~1,650 DOM èŠ‚ç‚¹ + 600ms æ±‡çŽ‡ç‰Œä»·ï¼‰ï¼šForm A ä¸‰çº§å¼‚æ­¥çº§è”ï¼ˆå« 95 å­—ç¬¦é•¿é€‰é¡¹ä¸Ž `:disabled` é€‰é¡¹ï¼‰ã€ä¿¡ç”¨ä»£ç è§„èŒƒåŒ–ã€8 ä½æ•æ„ŸæŽˆæƒç ã€`readonly`/`disabled`/`maxlength`ã€70ms å»¶è¿Ÿç„¦ç‚¹ä»£ç†ã€5 ç±»æ—¶é—´æŽ§ä»¶ã€å¤šé€‰ä¸Žä¸¤ç§ labelï¼›Form B åŠ¨æ€æˆå‘˜ä¸Ž `sum==100%`ï¼›Form C è·¨è¡¨ç²¾ç®—ã€å¯Œæ–‡æœ¬æ ¹ä¸Ž `contenteditable=false` å­èŠ‚ç‚¹ã€HTML5 æ‹–æ‹½ä¼šç­¾ã€éšè— chooser/æ‹–æ”¾ä¸Šä¼ ã€45 è¡Œå°è´¦ï¼›å…¨éƒ¨æ ¡éªŒé€šè¿‡å¹¶æäº¤åŽæ ¸å®šå•é“¾æŽ¥æ‰èŽ·å¾— hrefï¼ŒæœåŠ¡å™¨å¯¹æ— å›žæ‰§ä¸‹è½½è¿”å›ž 403ï¼ŒCSV æŒ‰ RFC 4180 è½¬ä¹‰å¹¶ä¸­å’Œå…¬å¼å‰ç¼€ |
| **`/arena-shadow-iframe`** (`+ /arena-frame-outer`, `/arena-frame-inner`) | ä¸‰å±‚åµŒå¥— Open Shadowï¼ˆå‘½å `<slot>`ã€å†…è” `<style>`/Lit æ³¨é‡Šé˜²æ±¡æŸ“ã€`composed:true` äº‹ä»¶ã€Shadow å†…æ‚¬æµ®èœå•ä¸Žè¡¨æ ¼ï¼‰ã€Open Shadow æ’æ§½åˆ—è¡¨ `#shadow-slotted-runbook`ï¼ˆå…·å/é»˜è®¤/å›žé€€ `<slot>` é¡ºåºã€é—­åˆ `<details>` éšè—è¡Œä½ç½®ä¿ç•™ã€åµŒå¥—å­åˆ—è¡¨ `#shadow-nested-sublist` éš”ç¦»ï¼‰ã€Closed Shadow è§†è§‰åæ ‡å…œåº•ï¼›åŒæº L1 å¸§ + è·¨æº `localhost` L1 å¸§ + å›žåˆ‡ `127.0.0.1` çš„ L2 å¸§ï¼ˆA->B->Aï¼‰ï¼Œ`postMessage` ä¸­ç»§ä¸Žå­å¸§å±€éƒ¨é‡è½½ |
| **`/arena-media-studio`** (`+ /arena-audio.wav`, `/captions-zh.vtt`, `/captions-en.vtt`) | åŽŸç”Ÿ `<video controls>` ä¸Ž `<audio controls>`ï¼ˆæœåŠ¡å™¨æ”¯æŒ HTTP `206 Range`ï¼‰ï¼šç« èŠ‚å¯»å€ `0.2s/1.8s/3.5s`ã€å€é€Ÿã€éŸ³é‡ `fill`/`drag`ã€é™éŸ³/å¾ªçŽ¯ï¼›ä¸­è‹± WebVTT å­—å¹• zh/en/off åˆ‡æ¢ä¸Ž `#active-caption-banner`ï¼›å¯»å€åŽ `<canvas>` å¸§åƒç´ é‡‡æ ·ï¼›4 æœŸèŠ‚ç›®å•åˆ‡æ­Œä¸Ž 48 è¡Œæ‰“ç‚¹è¡¨ |
| **`/arena-modern-spa-grid`** (`+ /arena-bfcache-detail`, `/redirect-cross-origin`, `/slow-doc`, `/download-stream`) | `?hydrate_ms=180` æ°´åˆæ›¿æ¢ä¸Ž pushState è·¯ç”±ï¼›`Cache-Control: no-cache`ã€é›¶ `unload` çš„çœŸå®ž bfcache å¾€è¿”ï¼›650ms å»¶è¿Ÿå¯¼èˆªã€æ…¢æ–‡æ¡£ã€`127.0.0.1 -> localhost` è·¨æº 302ã€é»˜è®¤æ—  `Content-Length` çš„æµå¼ä¸‹è½½ï¼ˆ`known_length=1` å¯åŠ å›žï¼‰ï¼›`oklch()` ç™½å­—/æ¸å˜å­—ä¿ç•™ vs éšè—æ–‡æœ¬è¯±é¥µï¼›å¯†ç ä¸Ž `autocomplete=one-time-code` è·¨é€šé“è„±æ•ï¼›5,000 è¡Œè™šæ‹Ÿè¡¨é»˜è®¤é”®æŽ§å¤ç”¨ï¼ˆä»å¯è§è¡Œä¿ç•™ DOM èŠ‚ç‚¹ï¼‰ï¼Œ`?vgrid=pool` ä¸º ag-grid å¼æ»šåŠ¨æ§½ä½å°±åœ°é‡ç»‘ï¼›ä¸‰å±‚ `rowspan/colspan` è´¢åŠ¡è¡¨ï¼›`?mega=1` çº¦ 6,800 èŠ‚ç‚¹ã€å¯è§æ–‡æœ¬ >200KBã€‚æ‰€æœ‰åŠ¨æ€è·¯ç”±çš„ HEAD è¯·æ±‚åªè¿”å›žå¤´éƒ¨ï¼Œä¸å†™äº‹ä»¶ã€ä¸ç­‰å¾… |

