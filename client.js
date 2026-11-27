/**
 * Browser half of the AI-workflow bundle.
 *
 * One right-sidebar tab, `ai-workflow`, drawing a ComfyUI-style canvas: agent
 * members with isolated contexts, an exchange node, chat input/output nodes, a
 * leader node and ComfyUI nodes whose real workflow graph is rendered in place.
 *
 * The graph lives on disk (`<workspace>/dsh-workflows/<session>/main.json`);
 * this module only talks to the Host's JSON routes, so the panel and the agent
 * always see the same file. Everything that reaches the model runs on the Host.
 */
window.__ModuleLoader__.load({
  id: 'dsh-ai-workflow',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Tab kind opened by the guide entry. */
    const TAB_KIND = 'ai-workflow'
    /** This implementation's identity; the key its body registers under. */
    const TAB_ID = 'dsh-ai-workflow'
    /** Locale namespace. */
    const NS = 'aiWorkflow'

    const EN = {
      "wfOpen": "'Workflow'",
      "wfTitle": "'AI workflow'",
      "wfHint": "'Left-drag a node · right-click to edit · wheel to zoom'",
      "wfAddModel": "'+ Model'",
      "wfAddExchange": "'+ Exchange'",
      "wfAddComfy": "'+ ComfyUI'",
      "wfAddInput": "'+ Input'",
      "wfAddLeader": "'+ Leader'",
      "wfAddOutput": "'+ Output'",
      "wfChatInput": "'Chat input'",
      "wfChatInputHint": "'The newest text typed in the main composer; Send passes it to the next node.'",
      "wfReadNow": "'Read composer'",
      "wfAutoRead": "'Follow the composer'",
      "wfOutputNode": "'Output'",
      "wfOutputHint": "'Whatever arrives here is also posted as the main reply.'",
      "wfPublished": "'Posted to chat'",
      "wfNotPublished": "'Not posted yet'",
      "wfResend": "'Post again'",
      "wfCheckUpdates": "'Check workflow updates'",
      "wfLeaderTitle": "'Leader · main chat'",
      "wfLeaderHint": "'This node is the conversation itself: it dispatches the composer text to its members and collects their results as the reply.'",
      "wfLeaderOnlyOne": "'There is already a Leader node'",
      "wfLeaderMembers": "'member results'",
      "wfLeaderUserInput": "'user message'",
      "wfDeleteEdge": "'Delete connection'",
      "wfCancel": "'Cancel'",
      "wfRun": "'Run'",
      "wfStop": "'Stop'",
      "wfSaved": "'Saved'",
      "wfSaving": "'Saving…'",
      "wfEmpty": "'Empty workflow'",
      "wfEmptyHint": "'Add a model node, then connect its output into another node or an exchange node.'",
      "wfModel": "'Model'",
      "wfPrompt": "'Node prompt'",
      "wfPromptHint": "'This prompt is the whole system context of this node. Other nodes never see it.'",
      "wfTools": "'Tools'",
      "wfSkills": "'Skills'",
      "wfMcps": "'MCP'",
      "wfNoTools": "'No tools selected'",
      "wfInput": "'Input'",
      "wfOutput": "'Output'",
      "wfExchange": "'Exchange'",
      "wfDispatch": "'Dispatch'",
      "wfDelete": "'Delete node'",
      "wfExchangePrompt": "'Exchange prompt'",
      "wfExchangeHint": "'Tell the model which upstream output to take, how to rewrite it, which downstream node gets it, and in what shape.'",
      "wfMode": "'Mode'",
      "wfModeAuto": "'Model routes by prompt'",
      "wfModeFanout": "'Copy to every downstream node'",
      "wfComfy": "'ComfyUI'",
      "wfComfyUrl": "'Server URL'",
      "wfComfyCheck": "'Check server'",
      "wfComfyStart": "'Start backend'",
      "wfComfyWorkflows": "'Workflow'",
      "wfComfyPrompt": "'Prompt text'",
      "wfComfySeed": "'Seed'",
      "wfComfySize": "'Size'",
      "wfComfyOverrides": "'Overrides (node id → inputs JSON)'",
      "wfComfyRefresh": "'Refresh list'",
      "wfComfyNotReady": "'ComfyUI is not reachable'",
      "wfComfyReady": "'ComfyUI is ready'",
      "wfComfyUiFormat": "'UI format — export API JSON to run'",
      "wfImage": "'Result'",
      "wfNoSession": "'No session on screen'",
      "wfRunDone": "'Run finished'",
      "wfRunFailed": "'Run failed'",
      "wfRunRunning": "'Running'",
      "wfCloseEditor": "'Close editor'",
      "wfViewGraph": "'View node graph'",
      "wfGraph": "'Graph'",
      "wfJson": "'JSON'",
      "wfZoomIn": "'Zoom in'",
      "wfZoomOut": "'Zoom out'",
      "wfGraphEmpty": "'No nodes in this workflow'",
      "wfNodeLib": "'Node library'",
      "wfNodeLibHint": "'The full ComfyUI node catalog read live from /object_info.'",
      "wfTargetPositive": "'Positive → node'",
      "wfTargetNegative": "'Negative → node'",
      "wfTargetReference": "'Reference image → node'",
      "wfPositive": "'Positive prompt'",
      "wfNegative": "'Negative prompt'",
      "wfReference": "'Reference image'",
      "wfUpload": "'Choose image'",
      "wfClear": "'Clear'",
      "wfCollapse": "'Collapse graph'",
      "wfExpand": "'Expand graph'",
      "wfNoNegative": "'This workflow has no negative-prompt input'",
      "wfPreview": "'Preview submit'"
    }

    const ZH = {
      "wfOpen": "'工作流'",
      "wfTitle": "'AI 工作流'",
      "wfHint": "'左键拖动节点 · 右键编辑 · 滚轮缩放'",
      "wfAddModel": "'＋模型'",
      "wfAddExchange": "'＋交换'",
      "wfAddComfy": "'＋ComfyUI'",
      "wfAddInput": "'＋输入'",
      "wfAddLeader": "'＋Leader'",
      "wfAddOutput": "'＋输出'",
      "wfChatInput": "'对话栏输入'",
      "wfChatInputHint": "'取主界面对话框最新输入的文字；点「运行」就把它送进下游节点。'",
      "wfReadNow": "'读取对话栏'",
      "wfAutoRead": "'跟随对话栏'",
      "wfOutputNode": "'输出'",
      "wfOutputHint": "'流到这里的内容同时作为主界面回复。'",
      "wfPublished": "'已回复到主界面'",
      "wfNotPublished": "'尚未回复'",
      "wfResend": "'再次回复'",
      "wfCheckUpdates": "'检查更新工作流'",
      "wfLeaderTitle": "'Leader · 主界面对话'",
      "wfLeaderHint": "'这个节点就是主界面这场对话：把对话栏文字派给成员，并收集成员结果作为回复。'",
      "wfLeaderOnlyOne": "'已经有一个 Leader 节点了'",
      "wfLeaderMembers": "'成员回报'",
      "wfLeaderUserInput": "'用户消息'",
      "wfDeleteEdge": "'删除连线'",
      "wfCancel": "'取消'",
      "wfRun": "'运行'",
      "wfStop": "'停止'",
      "wfSaved": "'已保存'",
      "wfSaving": "'保存中…'",
      "wfEmpty": "'空工作流'",
      "wfEmptyHint": "'先加一个模型节点，再把它的输出连到另一个节点或交换节点。'",
      "wfModel": "'模型'",
      "wfPrompt": "'节点提示词'",
      "wfPromptHint": "'这段提示词就是该节点的全部系统上下文，别的节点看不到。'",
      "wfTools": "'工具'",
      "wfSkills": "'技能'",
      "wfMcps": "'MCP'",
      "wfNoTools": "'未选工具'",
      "wfInput": "'输入'",
      "wfOutput": "'输出'",
      "wfExchange": "'交换'",
      "wfDispatch": "'分发'",
      "wfDelete": "'删除节点'",
      "wfExchangePrompt": "'交换提示词'",
      "wfExchangeHint": "'写清从上游拿什么、怎么改写、给哪个下游、用什么格式。'",
      "wfMode": "'模式'",
      "wfModeAuto": "'模型按提示词分发'",
      "wfModeFanout": "'原样复制给所有下游'",
      "wfComfy": "'ComfyUI'",
      "wfComfyUrl": "'服务地址'",
      "wfComfyCheck": "'检测服务'",
      "wfComfyStart": "'启动后端'",
      "wfComfyWorkflows": "'工作流'",
      "wfComfyPrompt": "'提示词'",
      "wfComfySeed": "'种子'",
      "wfComfySize": "'尺寸'",
      "wfComfyOverrides": "'覆盖（节点 id → inputs JSON）'",
      "wfComfyRefresh": "'刷新列表'",
      "wfComfyNotReady": "'ComfyUI 未就绪'",
      "wfComfyReady": "'ComfyUI 已就绪'",
      "wfComfyUiFormat": "'UI 格式，请导出 API JSON 后才能运行'",
      "wfImage": "'结果'",
      "wfNoSession": "'当前没有会话'",
      "wfRunDone": "'运行完成'",
      "wfRunFailed": "'运行失败'",
      "wfRunRunning": "'运行中'",
      "wfCloseEditor": "'退出编辑'",
      "wfViewGraph": "'查看节点图'",
      "wfGraph": "'节点图'",
      "wfJson": "'JSON'",
      "wfZoomIn": "'放大'",
      "wfZoomOut": "'缩小'",
      "wfGraphEmpty": "'这个工作流里没有节点'",
      "wfNodeLib": "'节点库'",
      "wfNodeLibHint": "'从运行中的后端 /object_info 实时读取的完整 ComfyUI 节点目录。'",
      "wfTargetPositive": "'正向写入节点'",
      "wfTargetNegative": "'负向写入节点'",
      "wfTargetReference": "'参考图写入节点'",
      "wfPositive": "'正向提示词'",
      "wfNegative": "'负向提示词'",
      "wfReference": "'参考图片'",
      "wfUpload": "'选择图片'",
      "wfClear": "'清除'",
      "wfCollapse": "'收起节点图'",
      "wfExpand": "'展开节点图'",
      "wfNoNegative": "'该工作流没有负向提示词输入'",
      "wfPreview": "'预览提交'"
    }

    function Button(props) {
      const tone = props.tone === undefined ? (props.primary === true ? 'primary' : 'plain') : props.tone
      return h(
        'button',
        {
          type: 'button',
          className: `dsh-tt-btn${tone === 'plain' ? '' : ` dsh-tt-btn-${tone}`}`,
          onClick: props.onClick,
          disabled: props.disabled === true,
          title: props.title,
          'aria-label': props.title,
        },
        props.label,
      )
    }    const WF_W = 250
    const WF_PORTS = { in: 44, exchange: 88, out: 62 }
    const WF_COMFY_W = 540
    const WF_COMFY_H = 408
    const WF_RUN_KEY = 'dsh-aiwf-run'

        async function wfCall(path, options = {}) {
      const url = new URL(`api/ai-workflow/${path}`, document.baseURI)
      for (const [key, value] of Object.entries(options.query ?? {})) {
        if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
      }
      const response = await fetch(url, {
        method: options.method ?? 'GET',
        headers: options.body === undefined ? undefined : { 'content-type': 'application/json' },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      })
      let data
      try {
        data = await response.json()
      } catch {
        data = { ok: false, error: `HTTP ${response.status}` }
      }
      if (response.ok !== true || data.ok === false) throw new Error(String(data.message ?? data.error ?? `HTTP ${response.status}`))
      return data
    }

        function readBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result ?? ''))
        reader.onerror = () => reject(reader.error ?? new Error('read failed'))
        reader.readAsDataURL(file)
      })
    }

        function wfDefaultTitle(type, index) {
      if (type === 'leader') return 'Leader'
      if (type === 'input') return '输入 ' + (index + 1)
      if (type === 'output') return '输出 ' + (index + 1)
      if (type === 'exchange') return '交换 ' + (index + 1)
      if (type === 'comfy') return 'ComfyUI ' + (index + 1)
      return '模型节点 ' + (index + 1)
    }

        function wfApplyRun(workflow, run) {
      if (workflow === null || run === undefined || run === null) return workflow
      const nodes = workflow.nodes.map((node) => {
        const live = run.nodes?.[node.id]
        if (live === undefined) return node
        return {
          ...node,
          status: live.status,
          output: live.text ?? node.output,
          error: live.error ?? '',
          ms: live.ms ?? node.ms,
          images: Array.isArray(live.images) && live.images.length > 0 ? live.images : node.images,
        }
      })
      return { ...workflow, nodes }
    }

    function LiteGraphView(props) {
  const ref = React.useRef(null)
  const sizeRef = React.useRef({ width: 0, height: 0 })
  /** Node rectangles in canvas pixels, refreshed by every draw. */
  const hitRef = React.useRef({ positions: new Map(), scale: 1, offsetX: 0, offsetY: 0, panX: 0, panY: 0 })
  const draw = React.useCallback(() => {
    const canvas = ref.current
    if (canvas === null || props.ui === undefined || props.ui === null) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio ?? 1
    const width = Math.max(80, Math.floor(rect.width))
    const height = Math.max(80, Math.floor(rect.height))
    sizeRef.current = { width, height, dpr }
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    const ctx = canvas.getContext('2d')
    if (ctx === null) return
    // A drawing failure must never take the panel down with it; the caller
    // shows the JSON tab instead when the canvas cannot paint.
    try {
      const result = drawLitegraph(ctx, props.ui, {
        width,
        height,
        dpr,
        scale: props.zoom ?? 1,
        offsetX: props.pan?.x ?? 0,
        offsetY: props.pan?.y ?? 0,
        highlight: props.highlight ?? [],
      })
      hitRef.current = { ...result, width, height }
    } catch (error) {
      console.warn('[wf] litegraph draw failed', error)
    }
  }, [props.ui, props.zoom, props.pan, props.highlight])

  React.useEffect(() => {
    draw()
    const onResize = () => draw()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [draw])

  /**
   * Turn a pointer position into the node under it, honouring the same
   * fit/offset transform the last draw used.
   * @param {React.PointerEvent} event - click on the canvas.
   * @returns {string|undefined} the node id.
   */
  const pick = (event) => {
    const canvas = ref.current
    if (canvas === null) return undefined
    const info = hitRef.current
    if (info.positions === undefined || info.positions.size === 0) return undefined
    const rect = canvas.getBoundingClientRect()
    const { bounds } = layoutLitegraph(props.ui)
    const padded = { x: bounds.x - 24, y: bounds.y - 24, width: bounds.width + 48, height: bounds.height + 48 }
    const fit = Math.min(info.width / padded.width, info.height / padded.height)
    const scale = Math.max(0.05, Math.min(2, (props.zoom ?? 1) * fit))
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top
    const worldX = (px - (props.pan?.x ?? 0)) / scale + padded.x
    const worldY = (py - (props.pan?.y ?? 0)) / scale + padded.y
    for (const node of info.positions.values()) {
      if (worldX >= node.x && worldX <= node.x + node.w && worldY >= node.y && worldY <= node.y + node.h) return String(node.id)
    }
    return undefined
  }

  const style = props.fill === true
    ? { width: '100%', height: '100%', minHeight: 0, display: 'block', cursor: 'pointer' }
    : { width: '100%', height: '100%', minHeight: 320, display: 'block', cursor: 'pointer' }
  return h('canvas', {
    className: 'dsh-wf-lite',
    ref,
    style,
    onClick: (event) => {
      const id = pick(event)
      if (id !== undefined && typeof props.onPick === 'function') props.onPick(id)
    },
  })
}

    /* ---------------------------------------------------------------- *
     * litegraph renderer (ComfyUI-style node canvas)
     * ---------------------------------------------------------------- */

    /**
     * A minimal litegraph renderer, ported from the drawing semantics
     * ComfyUI's frontend uses for its canvas: node frame + title bar + color,
     * input/output sockets with names, widgets, bezier links, and group boxes.
     * Read-only: it shows the real saved workflow graph inside the DSH canvas;
     * editing the graph itself still happens in ComfyUI.
     */

/**
 * ComfyUI's own palette, ported from litegraph's `node_colors` table: each
 * entry is the title bar / body pair ComfyUI paints for a node category.
 */
const COMFY_NODE_COLORS = {
  red: { title: '#a13030', body: '#3b1c1c' },
  green: { title: '#37723f', body: '#1d2f1f' },
  blue: { title: '#2a568c', body: '#1b2436' },
  pale_blue: { title: '#3f5159', body: '#2a363b' },
  cyan: { title: '#2f6b74', body: '#1c2c30' },
  purple: { title: '#6d3f8c', body: '#2c1d36' },
  yellow: { title: '#8c6d2a', body: '#3a2c17' },
  brown: { title: '#7a5333', body: '#32241a' },
  black: { title: '#333333', body: '#1e1e1e' },
}

/**
 * ComfyUI's link colors, keyed by the socket type it paints them with.
 */
const COMFY_LINK_COLORS = {
  MODEL: '#b39ddb',
  CLIP: '#ffd500',
  VAE: '#ff6e6e',
  IMAGE: '#64b5f6',
  MASK: '#81c784',
  LATENT: '#ff9cf9',
  CONDITIONING: '#ffa931',
  CONTROL_NET: '#a2dc6c',
  NOISE: '#cccccc',
  SAMPLER: '#b0b0b0',
  SIGMAS: '#9c9c9c',
  GUIDER: '#e0b060',
  INT: '#b0d0a0',
  FLOAT: '#b0d0a0',
  STRING: '#c0c0a0',
  default: '#9aa4ae',
}

/**
 * Pick the ComfyUI palette entry for one node class.
 * @param {string} type - node class name.
 * @returns {{ title: string, body: string }} colors.
 */
function nodePalette(type) {
  const text = String(type ?? '').toLowerCase()
  if (/save|preview|display/.test(text)) return COMFY_NODE_COLORS.red
  if (/unet|lora|checkpoint|model/.test(text)) return COMFY_NODE_COLORS.purple
  if (/clip|textenc|encode|prompt/.test(text)) return COMFY_NODE_COLORS.yellow
  if (/vae/.test(text)) return COMFY_NODE_COLORS.red
  if (/latent|empty/.test(text)) return COMFY_NODE_COLORS.cyan
  if (/sampler|noise|guider|sigmas|scheduler|steps/.test(text)) return COMFY_NODE_COLORS.blue
  if (/load|upload/.test(text)) return COMFY_NODE_COLORS.green
  if (/image|upscale|resize/.test(text)) return COMFY_NODE_COLORS.pale_blue
  return COMFY_NODE_COLORS.brown
}

/**
 * Pick a LiteGraph-style title-bar color for one node class.
 * @param {string} type - node class name.
 * @returns {string} css color.
 */
function nodeColor(type) {
  return nodePalette(type).title
}

/**
 * Link color for one socket type, following ComfyUI's link table.
 * @param {string} socketType - e.g. IMAGE, MODEL, INT.
 * @returns {string} css color.
 */
function linkColor(socketType) {
  const key = String(socketType ?? '').toUpperCase()
  return COMFY_LINK_COLORS[key] ?? COMFY_LINK_COLORS.default
}

/**
 * Measure and lay out one litegraph canvas view.
 * @param {{ nodes: object[], links: unknown[] }} ui - litegraph serialisation.
 * @returns {{ bounds: object, byId: Map<string, object> }} layout data.
 */
function layoutLitegraph(ui) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const byId = new Map()
  for (const node of ui?.nodes ?? []) {
    const pos = Array.isArray(node.pos) ? node.pos : [0, 0]
    const size = Array.isArray(node.size) ? node.size : [220, 120]
    const x = Number(pos[0]) || 0
    const y = Number(pos[1]) || 0
    const w = Math.max(120, Number(size[0]) || 220)
    const h = Math.max(60, Number(size[1]) || 120)
    byId.set(String(node.id), { ...node, x, y, w, h })
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x + w)
    maxY = Math.max(maxY, y + h)
  }
  if (!Number.isFinite(minX)) {
    minX = 0
    minY = 0
    maxX = 400
    maxY = 300
  }
  return { bounds: { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) }, byId }
}

/**
 * Draw one litegraph view onto a canvas context.
 * @param {CanvasRenderingContext2D} ctx - target context.
 * @param {{ nodes: object[], links: unknown[] }} ui - serialised graph.
 * @param {{ width: number, height: number, dpr?: number, offsetX?: number, offsetY?: number, scale?: number, highlight?: string[] }} options - viewport.
 * @returns {{ positions: Map<string, object>, scale: number }} where each node landed.
 */
function drawLitegraph(ctx, ui, options = {}) {
  const { width, height, dpr = 1, offsetX = 0, offsetY = 0, highlight = [] } = options
  const { bounds, byId } = layoutLitegraph(ui)
  const padded = { x: bounds.x - 24, y: bounds.y - 24, width: bounds.width + 48, height: bounds.height + 48 }
  const fit = Math.min(width / padded.width, height / padded.height)
  const scale = Math.max(0.05, Math.min(2, (options.scale ?? 1) * fit))
  ctx.save()
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'rgba(127,127,127,.06)'
  ctx.fillRect(0, 0, width, height)
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)
  ctx.translate(-padded.x, -padded.y)

  // Groups first, behind everything.
  for (const group of ui?.groups ?? []) {
    const box = Array.isArray(group.bounding) ? group.bounding : [0, 0, 0, 0]
    ctx.fillStyle = `${group.color === 'blue' ? '#2b5' : '#888'}14`
    ctx.strokeStyle = 'rgba(150,150,150,.45)'
    ctx.lineWidth = 1.5
    roundRect(ctx, box[0], box[1], box[2], box[3], 8)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'rgba(180,180,180,.8)'
    ctx.font = '13px sans-serif'
    ctx.fillText(String(group.title ?? ''), box[0] + 8, box[1] + 16)
  }

  // Links as bezier curves between socket anchors.
  const linkList = Array.isArray(ui?.links) ? ui.links : []
  const byLink = new Map()
  for (const link of linkList) {
    if (!Array.isArray(link)) continue
    byLink.set(link[0], link)
  }
  for (const link of linkList) {
    if (!Array.isArray(link)) continue
    const [, originId, originSlot, targetId, targetSlot] = link
    const from = byId.get(String(originId))
    const to = byId.get(String(targetId))
    if (from === undefined || to === undefined) continue
    const outputs = Array.isArray(from.outputs) ? from.outputs : []
    const inputs = Array.isArray(to.inputs) ? to.inputs : []
    const a = anchorOut(from, Number(originSlot) || 0, outputs.length)
    const b = anchorIn(to, Number(targetSlot) || 0, inputs.length)
    // ComfyUI colors a link by the type of the socket it leaves from.
    const socketType = outputs[Number(originSlot) || 0]?.type
    ctx.strokeStyle = linkColor(socketType)
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    const dx = Math.max(30, Math.abs(b.x - a.x) * 0.5)
    ctx.bezierCurveTo(a.x + dx, a.y, b.x - dx, b.y, b.x, b.y)
    ctx.stroke()
  }

  // Nodes.
  const positions = new Map()
  for (const node of byId.values()) {
    const highlighted = highlight.includes(String(node.id))
    const palette = nodePalette(node.type)
    const color = palette.title
    // ComfyUI paints a darker body and a colored title bar per category.
    ctx.fillStyle = palette.body
    ctx.strokeStyle = highlighted ? '#ffd166' : 'rgba(150,150,150,.55)'
    ctx.lineWidth = highlighted ? 2.5 : 1.2
    roundRect(ctx, node.x, node.y, node.w, node.h, 6)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = color
    roundRectTop(ctx, node.x, node.y, node.w, 24, 6)
    ctx.fill()
    ctx.fillStyle = '#eef2f5'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText(clipToWidth(ctx, String(node.title ?? node.type ?? ''), node.w - 16), node.x + 8, node.y + 16)

    const inputs = Array.isArray(node.inputs) ? node.inputs : []
    const outputs = Array.isArray(node.outputs) ? node.outputs : []
    const rows = Math.max(inputs.length, outputs.length)
    for (let i = 0; i < rows; i += 1) {
      const y = node.y + 36 + i * 18
      const input = inputs[i]
      if (input !== undefined) {
        socket(ctx, node.x, y, false)
        ctx.fillStyle = '#cfd6dd'
        ctx.font = '11px sans-serif'
        ctx.fillText(clipToWidth(ctx, String(input.name ?? ''), node.w / 2), node.x + 12, y + 4)
      }
      const output = outputs[i]
      if (output !== undefined) {
        socket(ctx, node.x + node.w, y, true)
        ctx.fillStyle = '#cfd6dd'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(clipToWidth(ctx, String(output.name ?? ''), node.w / 2), node.x + node.w - 12, y + 4)
        ctx.textAlign = 'left'
      }
    }

    // Widgets below the socket band, like the real canvas.
    const widgets = widgetValues(node)
    const start = node.y + 36 + rows * 18 + 6
    for (let i = 0; i < widgets.length; i += 1) {
      const y = start + i * 20
      if (y > node.y + node.h - 8) break
      ctx.fillStyle = 'rgba(70,74,80,.9)'
      roundRect(ctx, node.x + 8, y - 11, node.w - 16, 16, 3)
      ctx.fill()
      ctx.fillStyle = '#e6ebef'
      ctx.font = '10px sans-serif'
      ctx.fillText(clipToWidth(ctx, `${widgets[i].name}: ${widgets[i].value}`, node.w - 24), node.x + 12, y)
    }
    positions.set(String(node.id), node)
  }
  ctx.restore()
  return { positions, scale }
}

/**
 * Collect display widgets from either litegraph shape.
 * @param {object} node - raw node.
 * @returns {{ name: string, value: string }[]} up to eight rows.
 */
function widgetValues(node) {
  if (Array.isArray(node.widgets_values)) {
    return node.widgets_values.slice(0, 8).map((value, index) => ({ name: `#${index + 1}`, value: short(value) }))
  }
  const entries = Object.entries(node.inputs ?? {})
  return entries.filter(([, value]) => !Array.isArray(value)).slice(0, 8).map(([name, value]) => ({ name, value: short(value) }))
}

/**
 * Shorten any widget value for display.
 * @param {unknown} value - raw widget value.
 * @returns {string} text.
 */
function short(value) {
  if (Array.isArray(value)) return `[${value.map(short).join(', ')}]`
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 24)
  return String(value).slice(0, 48)
}

/**
 * Anchor point of an output socket.
 * @param {object} node - laid-out node.
 * @param {number} slot - socket index.
 * @param {number} count - total outputs.
 * @returns {{ x: number, y: number }} point.
 */
function anchorOut(node, slot, count) {
  return { x: node.x + node.w, y: node.y + 36 + slot * 18 + (count === 0 ? 0 : 0) }
}

/**
 * Anchor point of an input socket.
 * @param {object} node - laid-out node.
 * @param {number} slot - socket index.
 * @param {number} count - total inputs.
 * @returns {{ x: number, y: number }} point.
 */
function anchorIn(node, slot, count) {
  void count
  return { x: node.x, y: node.y + 36 + slot * 18 }
}

/**
 * Draw one socket circle.
 * @param {CanvasRenderingContext2D} ctx - context.
 * @param {number} x - center x.
 * @param {number} y - center y.
 * @param {boolean} out - output side.
 */
function socket(ctx, x, y, out) {
  ctx.fillStyle = out ? '#9ecbff' : '#8fe3a1'
  ctx.beginPath()
  ctx.arc(x, y, 4, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Rounded rectangle path.
 * @param {CanvasRenderingContext2D} ctx - context.
 * @param {number} x - left.
 * @param {number} y - top.
 * @param {number} w - width.
 * @param {number} h - height.
 * @param {number} r - radius.
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/**
 * Rounded top half only (title bars).
 * @param {CanvasRenderingContext2D} ctx - context.
 * @param {number} x - left.
 * @param {number} y - top.
 * @param {number} w - width.
 * @param {number} h - height.
 * @param {number} r - radius.
 */
function roundRectTop(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/**
 * Ellipsize text to a pixel budget.
 * @param {CanvasRenderingContext2D} ctx - context with font set.
 * @param {string} text - source.
 * @param {number} max - pixels.
 * @returns {string} possibly truncated text.
 */
function clipToWidth(ctx, text, max) {
  const value = String(text ?? '')
  if (typeof ctx.measureText !== 'function') return value
  if (ctx.measureText(value).width <= max) return value
  let out = value
  while (out.length > 1 && ctx.measureText(out + '\u2026').width > max) out = out.slice(0, -1)
  return out + '\u2026'
}

    
    /**
     * Keep a render failure inside the panel instead of taking the sidebar down.
     */
    class PanelBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }

      static getDerivedStateFromError(error) {
        return { error }
      }

      render() {
        if (this.state.error !== null) {
          const text = String(this.state.error?.stack ?? this.state.error)
          return h(
            'div',
            { className: 'dsh-aw-crash' },
            h('strong', null, this.props.title ?? 'Panel failed'),
            h('pre', null, text.slice(0, 4000)),
          )
        }
        return this.props.children
      }
    }

/** Styles that only the workflow canvas uses. */
    const WF_CSS = `
.dsh-wf-root{position:relative;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:12px}
.dsh-wf-head{display:flex;align-items:center;gap:6px;padding:6px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;flex:none}
.dsh-wf-title{font-weight:600;margin-right:4px}
.dsh-wf-sp{flex:1}
.dsh-wf-pill{font-size:11px;color:var(--dsw-alias-label-secondary);padding:2px 7px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;white-space:nowrap}
.dsh-wf-pill.run{color:var(--dsw-alias-state-success-primary);border-color:currentColor}
.dsh-wf-pill.err{color:var(--dsw-alias-state-error-primary);border-color:currentColor}
.dsh-wf-canvas{position:relative;flex:1;min-height:320px;overflow:hidden;background:radial-gradient(circle at 1px 1px, rgba(127,127,127,.18) 1px, transparent 1px) 0 0/18px 18px;touch-action:none;cursor:default}
.dsh-wf-world{position:absolute;left:0;top:0;width:6000px;height:6000px;transform-origin:0 0}
.dsh-wf-svg{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:6}
.dsh-wf-edge{fill:none;stroke:var(--dsw-alias-border-l2);stroke-width:2;pointer-events:none;stroke-linecap:round}
.dsh-wf-edge:hover{stroke:var(--dsw-alias-state-error-primary)}
.dsh-wf-edge-hit{fill:none;stroke:transparent;stroke-width:14;pointer-events:stroke;cursor:pointer}
.dsh-wf-edge-live{fill:none;stroke:var(--dsw-alias-brand-primary);stroke-width:2;stroke-dasharray:6 5}
.dsh-wf-node{position:absolute;z-index:1;width:${WF_W}px;min-height:128px;border-radius:12px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);box-shadow:0 6px 18px rgba(0,0,0,.18);user-select:none}
.dsh-wf-node.sel{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dsh-wf-node.running{border-color:var(--dsw-alias-state-success-primary)}
.dsh-wf-node.error{border-color:var(--dsw-alias-state-error-primary)}
.dsh-wf-node-head{display:flex;align-items:center;gap:6px;padding:7px 10px;background:var(--dsw-alias-bg-layer-2);cursor:grab;border-radius:11px 11px 0 0}
.dsh-wf-node-head:active{cursor:grabbing}
.dsh-wf-node-title{font-weight:600;font-size:12px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.dsh-wf-kind{font-size:9px;letter-spacing:.06em;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:1px 5px;flex:none}
.dsh-wf-node-body{padding:8px 10px 10px;display:flex;flex-direction:column;gap:6px;min-height:88px;overflow:hidden}
.dsh-wf-node-model{font-size:11px;line-height:1.4;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-wf-badges{display:flex;gap:4px;flex-wrap:wrap;min-height:16px}
.dsh-wf-badge{font-size:10px;line-height:1.5;padding:1px 6px;border-radius:6px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
.dsh-wf-node-out{font-size:11px;line-height:1.45;color:var(--dsw-alias-label-secondary);max-height:46px;overflow:hidden;white-space:pre-wrap;word-break:break-word}
.dsh-wf-mini{width:100%;height:62px;display:block;border-radius:7px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);flex:none}
.dsh-wf-biggraph{width:100%;height:100%;min-height:0;display:block;border-radius:8px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1)}
.dsh-wf-thumb{width:100%;max-height:120px;object-fit:contain;border-radius:8px;background:#000;margin-top:2px}
.dsh-wf-port{position:absolute;width:11px;height:11px;border-radius:50%;background:var(--dsw-alias-bg-base);border:2px solid var(--dsw-alias-border-l2);cursor:crosshair;z-index:2}
.dsh-wf-port.out{border-color:var(--dsw-alias-brand-primary)}
.dsh-wf-port.exchange{border-color:var(--dsw-alias-state-success-primary);border-radius:3px}
.dsh-wf-port:hover{background:var(--dsw-alias-brand-primary)}
.dsh-wf-port-label{position:absolute;font-size:9px;color:var(--dsw-alias-label-secondary);transform:translateY(-50%);white-space:nowrap;pointer-events:none}
.dsh-wf-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-idle-primary);flex:none}
.dsh-wf-dot.running{background:var(--dsw-alias-state-success-primary);animation:dsh-wf-pulse 1s infinite}
.dsh-wf-dot.done{background:var(--dsw-alias-state-success-primary)}
.dsh-wf-dot.error{background:var(--dsw-alias-state-error-primary)}
@keyframes dsh-wf-pulse{0%,100%{opacity:1}50%{opacity:.35}}
.dsh-wf-inspector{position:relative;flex:0 0 auto;max-height:46%;width:auto;margin:0 8px 6px;overflow:auto;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:9px;box-shadow:0 -6px 18px rgba(0,0,0,.18);z-index:5}
.dsh-wf-inspector h4{margin:0;font-size:12px;display:flex;align-items:center;gap:6px}
.dsh-wf-field{display:flex;flex-direction:column;gap:3px}
.dsh-wf-field>span{font-size:10px;color:var(--dsw-alias-label-secondary);text-transform:uppercase;letter-spacing:.03em}
.dsh-wf-input,.dsh-wf-select,.dsh-wf-area{width:100%;box-sizing:border-box;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;color:inherit;font:inherit;padding:5px 7px;outline:none}
.dsh-wf-input:focus,.dsh-wf-select:focus,.dsh-wf-area:focus{border-color:var(--dsw-alias-brand-primary)}
.dsh-wf-area{resize:vertical;min-height:86px;line-height:1.5}
.dsh-wf-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.dsh-wf-checks{max-height:150px;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:4px 6px;display:flex;flex-direction:column;gap:2px;background:var(--dsw-alias-bg-base)}
.dsh-wf-check{display:flex;gap:6px;align-items:center;font-size:11px;line-height:1.5;cursor:pointer}
.dsh-wf-check input{margin:0}
.dsh-wf-check small{color:var(--dsw-alias-label-secondary);font-size:10px}
.dsh-wf-empty{position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);text-align:center;color:var(--dsw-alias-label-secondary);display:flex;flex-direction:column;gap:6px;max-width:80%}
.dsh-wf-empty strong{color:var(--dsw-alias-label-primary);font-size:14px}
.dsh-wf-error{padding:4px 10px;color:var(--dsw-alias-state-error-primary);font-size:11px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dsh-wf-foot{display:flex;gap:6px;align-items:center;padding:4px 10px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:10px;flex:none}
.dsh-wf-modal{position:absolute;inset:0;z-index:30;background:rgba(0,0,0,.48);display:flex;align-items:center;justify-content:center;padding:10px}
.dsh-wf-modal-card{width:100%;max-height:88%;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.45)}
.dsh-wf-modal-head{display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none}
.dsh-wf-modal-title{font-weight:600;font-size:12px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-wf-menu{position:absolute;z-index:20;display:flex;flex-direction:column;gap:4px;padding:6px;min-width:150px;max-width:240px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;box-shadow:0 10px 26px rgba(0,0,0,.32)}
.dsh-wf-menu-title{font-size:10px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 4px 2px}
.dsh-wf-lite{display:block;width:100%;height:100%;max-height:100%;border-radius:10px;border:1px solid var(--dsw-alias-border-l1);background:#14161a}
.dsh-wf-modal-body{flex:1;min-height:0;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px}
.dsh-wf-graph{display:block;background:var(--dsw-alias-bg-base);border-radius:10px;border:1px solid var(--dsw-alias-border-l1)}
.dsh-wf-json{font:10px/1.45 ui-monospace,Consolas,monospace;white-space:pre-wrap;word-break:break-word;margin:0;color:var(--dsw-alias-label-secondary)}
.dsh-wf-mcp-row{display:flex;gap:8px;align-items:center;padding:7px 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-base)}
.dsh-wf-mcp-row main{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.dsh-wf-mcp-name{font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-wf-mcp-note{font-size:10px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-wf-mcp-state{font-size:9px;padding:1px 6px;border-radius:999px;border:1px solid currentColor;flex:none}
.dsh-wf-mcp-state.on{color:var(--dsw-alias-state-success-primary)}
.dsh-wf-mcp-state.off{color:var(--dsw-alias-label-secondary)}
.dsh-wf-grid2{display:grid;grid-template-columns:1fr 1fr;gap:6px}
`

    /**
     * One small labelled form row.
     * @param {object} props - `{ label, children }`.
     * @returns {object} React element.
     */
    function WfField(props) {
      return h('label', { className: 'dsh-wf-field' }, h('span', null, props.label), props.children)
    }

    /**
     * The workflow canvas tab body.
     * @param {object} props - framework slot props plus `t`.
     * @returns {object} React element.
     */
    function WorkflowPanel(props) {
      const { t, ctx } = props
      const sessionId = props.sessionId || props.session?.id || props.session?.sessionId || ''
      const [workflow, setWorkflow] = React.useState(null)
      const [catalog, setCatalog] = React.useState({ providers: [], models: [], tools: [], skills: [], mcps: [] })
      const [selected, setSelected] = React.useState('')
      const [error, setError] = React.useState('')
      const [notice, setNotice] = React.useState('')
      const [saving, setSaving] = React.useState(false)
      const [runId, setRunId] = React.useState('')
      const [run, setRun] = React.useState(null)
      const [view, setView] = React.useState({ x: 48, y: 48, k: 1 })
      const [link, setLink] = React.useState(null)
      const [comfy, setComfy] = React.useState({ status: null, workflows: [], busy: '' })
      const [toolQuery, setToolQuery] = React.useState('')
      const [editing, setEditing] = React.useState('')
      const [graphs, setGraphs] = React.useState({})
      const [graphModal, setGraphModal] = React.useState(null)
      const [collapsed, setCollapsed] = React.useState({})
      const [comfyPreview, setComfyPreview] = React.useState(null)
      const [targets, setTargets] = React.useState({})
      const [nodeLib, setNodeLib] = React.useState({ open: false, data: null, error: '', query: '' })
      const [comfyRaw, setComfyRaw] = React.useState({})
      /** Right-clicked connection: `{ id, x, y, label }` or null. */
      const [edgeMenu, setEdgeMenu] = React.useState(null)

      const canvasRef = React.useRef(null)
      const viewRef = React.useRef(view)
      viewRef.current = view
      const savedRef = React.useRef('')
      const workflowRef = React.useRef(null)
      workflowRef.current = workflow
      const selectedRef = React.useRef('')
      selectedRef.current = selected

      // Load the graph once per session.
      React.useEffect(() => {
        let alive = true
        if (sessionId === '') {
          setWorkflow({ version: 1, id: 'main', title: 'AI 工作流', nodes: [], edges: [] })
          return () => { alive = false }
        }
        void (async () => {
          try {
            const data = await wfCall('load', { query: { sessionId } })
            if (!alive) return
            setWorkflow(data.workflow)
            savedRef.current = JSON.stringify({ title: data.workflow.title, nodes: data.workflow.nodes.map(wfPersisted), edges: data.workflow.edges })
            if (data.source === 'new') setNotice(t('wfEmpty'))
          } catch (caught) {
            if (alive) setError(String(caught.message ?? caught))
          }
          // A run started before this reload keeps streaming once re-attached.
          try {
            const stored = sessionStorage.getItem(WF_RUN_KEY)
            if (alive && stored !== null && stored !== '') setRunId(stored)
          } catch {
            /* sessionStorage may be unavailable */
          }
        })()
        void (async () => {
          try {
            const data = await wfCall('catalog', { query: { sessionId } })
            if (alive) setCatalog({ providers: data.providers ?? [], models: data.models ?? [], tools: data.tools ?? [], skills: data.skills ?? [], mcps: data.mcps ?? [] })
          } catch {
            /* the catalog is advisory; a node can still be edited offline */
          }
        })()
        void (async () => {
          try {
            const data = await wfCall('comfy/workflows')
            if (alive) setComfy(current => ({ ...current, workflows: data.workflows ?? [] }))
          } catch {
            /* ComfyUI is optional */
          }
        })()
        return () => { alive = false }
      }, [sessionId])

      // Debounced save. The signature ignores live run fields so polling does not
      // write the file on every delta.
      React.useEffect(() => {
        if (workflow === null || sessionId === '') return undefined
        const signature = JSON.stringify({ title: workflow.title, nodes: workflow.nodes.map(wfPersisted), edges: workflow.edges })
        if (signature === savedRef.current) return undefined
        const timer = setTimeout(() => {
          setSaving(true)
          void (async () => {
            try {
              await wfCall('save', { method: 'POST', body: { sessionId, workflow } })
              savedRef.current = signature
              setNotice(t('wfSaved'))
              setError('')
            } catch (caught) {
              setError(String(caught.message ?? caught))
            } finally {
              setSaving(false)
            }
          })()
        }, 700)
        return () => clearTimeout(timer)
      }, [workflow, sessionId, t])

      // Load a compact node graph for every ComfyUI workflow referenced by a node,
// so the node card shows the real ComfyUI graph instead of only a file name.
      React.useEffect(() => {
        if (workflow === null) return
        const names = [...new Set(workflow.nodes.filter(node => node.type === 'comfy' && node.workflow !== '').map(node => node.workflow))]
        for (const name of names) {
          if (graphs[name] === undefined) {
            void wfCall('comfy/json', { query: { name } })
              .then((data) => { setGraphs(current => current[name] === undefined ? { ...current, [name]: data } : current) })
              .catch(() => undefined)
          }
          // API workflows expose their injectable nodes; UI ones answer with a
          // plain error that simply leaves the target lists empty.
          if (targets[name] === undefined) {
            void wfCall('comfy/targets', { query: { name } })
              .then((data) => { setTargets(current => current[name] === undefined ? { ...current, [name]: data } : current) })
              .catch(() => undefined)
          }
          // The raw saved graph is what the litegraph view renders.
          if (comfyRaw[name] === undefined) {
            void wfCall('comfy/json', { query: { name } })
              .then((data) => { setComfyRaw(current => current[name] === undefined ? { ...current, [name]: data.ui ?? data.json ?? null } : current) })
              .catch(() => undefined)
          }
        }
      }, [workflow, graphs, targets])

      // Poll one live run until it settles.
      React.useEffect(() => {
        if (runId === '') return undefined
        let cancelled = false
        let timer = 0
        const tick = async () => {
          try {
            const data = await wfCall('run/status', { query: { runId } })
            if (cancelled) return
            console.log('[wf] run/status', data.run.status, JSON.stringify(Object.fromEntries(Object.entries(data.run.nodes ?? {}).map(([id, n]) => [id, { status: n.status, images: (n.images ?? []).length }]))))
            setRun(data.run)
            setWorkflow(current => {
              const merged = wfApplyRun(current, data.run)
              console.log('[wf] merged', JSON.stringify(merged.nodes.map(n => ({ id: n.id, status: n.status, images: (n.images ?? []).length }))))
              return merged
            })
            if (data.run.status !== 'running') {
              try { sessionStorage.removeItem(WF_RUN_KEY) } catch { /* ignore */ }
              setNotice(data.run.status === 'done' ? t('wfRunDone') : (data.run.error || t('wfRunFailed')))
              setRunId('')
              return
            }
          } catch (caught) {
            if (cancelled) return
            setError(String(caught.message ?? caught))
            setRunId('')
            return
          }
          if (!cancelled) timer = setTimeout(tick, 700)
        }
        timer = setTimeout(tick, 250)
        return () => { cancelled = true; clearTimeout(timer) }
      }, [runId, t])

      // Wheel zoom must be non-passive to stop the page scrolling under it.
      React.useEffect(() => {
        const canvas = canvasRef.current
        if (canvas === null) return undefined
        const onWheel = (event) => {
          event.preventDefault()
          const rect = canvas.getBoundingClientRect()
          const current = viewRef.current
          const next = Math.max(0.35, Math.min(1.8, current.k * (event.deltaY < 0 ? 1.08 : 0.92)))
          const px = event.clientX - rect.left
          const py = event.clientY - rect.top
          setView({
            k: next,
            x: px - ((px - current.x) / current.k) * next,
            y: py - ((py - current.y) / current.k) * next,
          })
        }
        canvas.addEventListener('wheel', onWheel, { passive: false })
        return () => canvas.removeEventListener('wheel', onWheel)
      }, [])

      const nodeById = new Map((workflow?.nodes ?? []).map(node => [node.id, node]))
      const selectedNode = selected === '' ? undefined : nodeById.get(selected)
      const editingNode = editing === '' ? undefined : nodeById.get(editing)
      const isExpanded = node => node !== undefined && node.type === 'comfy' && node.workflow !== '' && (comfyRaw[node.workflow] ?? graphs[node.workflow]?.ui ?? null) !== null && collapsed[node.id] !== true
      const sizeOf = node => {
        if (node === undefined) return { w: WF_W, h: 140 }
        if (isExpanded(node)) return { w: WF_COMFY_W, h: WF_COMFY_H }
        return { w: WF_W, h: node.type === 'comfy' ? 150 : 140 }
      }
      const portOffset = (node, port) => {
        if (node.type === 'leader') return port === 'result' ? 78 : 38
        if (node.type === 'input') return 46
        if (node.type === 'output') return 46
        if (node.type === 'comfy') {
          const expanded = isExpanded(node)
          const base = expanded ? { in: 58, negative: 98, image: 138, out: 58 } : { in: 46, negative: 80, image: 114, out: 46 }
          return base[port] ?? base.in
        }
        if (node.type === 'exchange') return port === 'out' ? 46 : 46
        if (port === 'out') return WF_PORTS.out
        if (port === 'exchange') return WF_PORTS.exchange
        return WF_PORTS.in
      }

      const patchNode = (id, patch) => {
        setWorkflow(current => current === null ? current : ({
          ...current,
          nodes: current.nodes.map(node => (node.id === id ? { ...node, ...patch } : node)),
        }))
      }

      const addNode = (type) => {
        // The leader is the conversation itself, so exactly one may exist.
        if (type === 'leader' && (workflow?.nodes ?? []).some(node => node.type === 'leader')) {
          setNotice(t('wfLeaderOnlyOne'))
          return
        }
        const count = (workflow?.nodes ?? []).length
        const typeCount = (workflow?.nodes ?? []).filter(node => node.type === type).length
        const id = `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
        const first = catalog.models.find(model => model.provider === 'ali' && model.id === 'deepseek-v4.1-flash-1017')
          ?? catalog.models.find(model => model.provider === 'ali')
          ?? catalog.models[0]
        const node = {
          id,
          type,
          title: wfDefaultTitle(type, typeCount),
          // Placement is world-fixed: adding a node while the inspector is open
          // shrinks the canvas, and a viewport-relative origin would pile the
          // next node on top of an earlier one.
          x: 20 + (count % 2) * 300,
          y: 20 + Math.floor(count / 2) * 190,
          provider: type === 'model' ? (first?.provider ?? '') : '',
          model: type === 'model' ? (first?.id ?? '') : '',
          reasoningEffort: '',
          prompt: type === 'exchange'
            ? '把上游多个节点的结果对比、提炼成给下游能直接用的材料。只写事实与结论，不要客套。'
            : '',
          tools: [],
          skills: [],
          mcps: [],
          mode: 'auto',
          targets: [],
          baseUrl: 'http://127.0.0.1:8188',
          workflow: '',
          promptText: '',
          negativeText: '',
          referenceImage: '',
          overrides: {},
          autoRead: true,
          value: '',
          published: false,
          status: 'idle',
          output: '',
          error: '',
          ms: 0,
          images: [],
        }
        setWorkflow(current => current === null ? current : ({ ...current, nodes: [...current.nodes, node] }))
        setSelected(id)
      }

      const removeNode = (id) => {
        setWorkflow(current => current === null ? current : ({
          ...current,
          nodes: current.nodes.filter(node => node.id !== id),
          edges: current.edges.filter(edge => edge.from.node !== id && edge.to.node !== id),
        }))
        setSelected('')
      }

      const addEdge = (from, to) => {
        if (from.node === to.node) return
        setWorkflow(current => {
          if (current === null) return current
          if (current.edges.some(edge => edge.from.node === from.node && edge.from.port === from.port && edge.to.node === to.node && edge.to.port === to.port)) return current
          return { ...current, edges: [...current.edges, { id: `e${Date.now().toString(36)}`, from, to }] }
        })
      }

      const removeEdge = (id) => {
        setWorkflow(current => current === null ? current : ({ ...current, edges: current.edges.filter(edge => edge.id !== id) }))
      }

      const beginDrag = (event, node) => {
        if (event.button !== 0) return
        event.stopPropagation()
        setSelected(node.id)
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect === undefined) return
        const startX = event.clientX
        const startY = event.clientY
        const originX = node.x
        const originY = node.y
        const k = viewRef.current.k
        const move = (moveEvent) => {
          patchNode(node.id, {
            x: Math.round(originX + (moveEvent.clientX - startX) / k),
            y: Math.round(originY + (moveEvent.clientY - startY) / k),
          })
        }
        const up = () => {
          document.removeEventListener('pointermove', move)
          document.removeEventListener('pointerup', up)
        }
        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', up)
      }

      const beginPan = (event) => {
        if (event.button !== 0 && event.button !== 1) return
        const target = event.target
        const closest = typeof target?.closest === 'function' ? target.closest('.dsh-wf-node, .dsh-wf-inspector') : null
        if (closest !== null) return
        const startX = event.clientX
        const startY = event.clientY
        const origin = viewRef.current
        let moved = false
        const move = (moveEvent) => {
          if (Math.abs(moveEvent.clientX - startX) + Math.abs(moveEvent.clientY - startY) > 4) moved = true
          setView({ k: origin.k, x: origin.x + (moveEvent.clientX - startX), y: origin.y + (moveEvent.clientY - startY) })
        }
        const up = () => {
          document.removeEventListener('pointermove', move)
          document.removeEventListener('pointerup', up)
          if (!moved) {
            setSelected('')
            setEditing('')
          }
        }
        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', up)
      }

      const beginLink = (event, node, port) => {
        if (event.button !== 0) return
        event.stopPropagation()
        event.preventDefault()
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect === undefined) return
        const pointOf = (pointerEvent) => ({
          x: (pointerEvent.clientX - rect.left - viewRef.current.x) / viewRef.current.k,
          y: (pointerEvent.clientY - rect.top - viewRef.current.y) / viewRef.current.k,
        })
        const from = { node: node.id, port }
        const start = pointOf(event)
        setLink({ from, x: start.x, y: start.y })
        const move = (moveEvent) => {
          const point = pointOf(moveEvent)
          setLink(current => current === null ? current : { ...current, x: point.x, y: point.y })
        }
        const up = (upEvent) => {
          document.removeEventListener('pointermove', move)
          document.removeEventListener('pointerup', up)
          const element = document.elementFromPoint(upEvent.clientX, upEvent.clientY)
          const portElement = element?.closest?.('[data-port]')
          if (portElement !== null && portElement !== undefined) {
            const nodeId = portElement.getAttribute('data-node') ?? ''
            const portKey = portElement.getAttribute('data-port') ?? ''
            if (nodeId !== '' && portKey !== '' && portKey !== port) addEdge(from, { node: nodeId, port: portKey })
          }
          setLink(null)
        }
        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', up)
      }

      /**
       * Title-bar color for one AI-workflow node kind, taken from the same
       * ComfyUI palette (purple model, yellow text, cyan latent, red output…).
       * @param {string} type - model | exchange | comfy | input | output | leader.
       * @returns {string} css color.
       */
      const typeColor = (type) => {
        if (type === 'model') return '#6d3f8c'
        if (type === 'exchange') return '#8c6d2a'
        if (type === 'comfy') return '#2a568c'
        if (type === 'input') return '#37723f'
        if (type === 'output') return '#a13030'
        if (type === 'leader') return '#2f6b74'
        return '#3f5159'
      }
      /**
       * Socket type of one edge, used only to pick its color.
       * @param {object} edge - workflow edge.
       * @returns {string} a ComfyUI-style type name.
       */
      const portSocketType = (edge) => {
        const source = nodeById.get(edge.from.node)
        if (source === undefined) return 'default'
        if (source.type === 'leader') return 'CONDITIONING'
        if (source.type === 'input') return 'STRING'
        if (source.type === 'output') return 'IMAGE'
        if (source.type === 'exchange') return 'CONDITIONING'
        if (source.type === 'comfy') return edge.from.port === 'negative' ? 'CONDITIONING' : edge.from.port === 'out' ? 'IMAGE' : edge.from.port === 'image' ? 'IMAGE' : 'MODEL'
        return 'MODEL'
      }

      const portPoint = (nodeId, port) => {
        const node = nodeById.get(nodeId)
        if (node === undefined) return { x: 0, y: 0 }
        const size = sizeOf(node)
        const y = node.y + portOffset(node, port)
        if (port === 'out') return { x: node.x + size.w, y }
        return { x: node.x, y }
      }

      const startRun = async () => {
        if (workflow === null) return
        setError('')
        setRun(null)
        setNotice(t('wfRunRunning'))
        try {
          const data = await wfCall('run', { method: 'POST', body: { sessionId, workflow } })
          try { sessionStorage.setItem(WF_RUN_KEY, data.runId) } catch { /* ignore */ }
          setRunId(data.runId)
        } catch (caught) {
          setError(String(caught.message ?? caught))
        }
      }

      const stopRun = async () => {
        if (runId === '') return
        try {
          await wfCall('run/cancel', { method: 'POST', body: { runId } })
        } catch (caught) {
          setError(String(caught.message ?? caught))
        }
      }

      const checkComfy = async (node) => {
        setComfy(current => ({ ...current, busy: 'check' }))
        try {
          const data = await wfCall('comfy/status', { query: { baseUrl: node.baseUrl } })
          setComfy(current => ({ ...current, status: data.ok === true ? data.system : null, busy: '' }))
          if (data.ok !== true) setError(String(data.error ?? t('wfComfyNotReady')))
          else setError('')
        } catch (caught) {
          setComfy(current => ({ ...current, status: null, busy: '' }))
          setError(String(caught.message ?? caught))
        }
      }

      const startComfyBackend = async () => {
        setComfy(current => ({ ...current, busy: 'start' }))
        try {
          await wfCall('comfy/start', { method: 'POST', body: {} })
          setNotice('ComfyUI 正在启动，首次加载模型会比较久…')
        } catch (caught) {
          setError(String(caught.message ?? caught))
        } finally {
          setComfy(current => ({ ...current, busy: '' }))
        }
      }

      const refreshComfyWorkflows = async () => {
        setComfy(current => ({ ...current, busy: 'list' }))
        try {
          // Drop the cached graph/targets so a workflow edited in ComfyUI is
          // re-read instead of serving the version from page load.
          setGraphs({})
          setTargets({})
          setComfyRaw({})
          const data = await wfCall('comfy/workflows')
          setComfy(current => ({ ...current, workflows: data.workflows ?? [], busy: '' }))
          setNotice(`已刷新：${(data.workflows ?? []).length} 个工作流`)
        } catch (caught) {
          setError(String(caught.message ?? caught))
          setComfy(current => ({ ...current, busy: '' }))
        }
      }

      const readChatInput = async () => {
        try {
          const data = await wfCall('chat/input', { query: { sessionId } })
          const text = String(data.text ?? '')
          const card = nodeById.get(editing === '' ? selected : editing)
          if (card !== undefined) patchNode(card.id, { value: text })
          setNotice(text === '' ? '对话栏还没有文字' : '已读取对话栏文字')
        } catch (caught) {
          setError(String(caught.message ?? caught))
        }
      }

      const republishOutput = async (card) => {
        try {
          const receipt = await wfCall('chat/reply', { method: 'POST', body: { sessionId, text: card.output ?? '' } })
          patchNode(card.id, { published: receipt.ok === true })
          setNotice(receipt.ok === true ? t('wfPublished') : `回复失败：${receipt.error ?? ''}`)
        } catch (caught) {
          setError(String(caught.message ?? caught))
        }
      }

      const renderChecks = (items, values, onToggle, describe) => h(
        'div',
        { className: 'dsh-wf-checks' },
        items.length === 0
          ? h('span', { className: 'dsh-wf-node-model' }, '—')
          : items.map(item => h(
            'label',
            { className: 'dsh-wf-check', key: item.name ?? item.id },
            h('input', {
              type: 'checkbox',
              checked: values.includes(item.name ?? item.id),
              onChange: () => onToggle(item.name ?? item.id),
            }),
            h('span', null, item.name ?? item.id, describe === undefined ? null : h('small', null, ` ${describe(item)}`)),
          )),
      )

      const renderInspector = () => {
        const node = editingNode
        if (node === undefined) return null
        const graphNodes = node.type === 'comfy' && graphs[node.workflow] !== undefined ? graphs[node.workflow].nodes : []
        const loadImages = graphNodes.filter(item => item.title === 'LoadImage')
        const comfyTargets = node.type === 'comfy' ? targets[node.workflow] : undefined
        const positives = (comfyTargets?.positives ?? []).map(item => ({ ...item, title: graphNodes.find(g => g.id === item.id)?.title ?? item.classType }))
        const negatives = (comfyTargets?.negatives ?? []).map(item => ({ ...item, title: graphNodes.find(g => g.id === item.id)?.title ?? item.classType }))
        const imageTargets = comfyTargets?.images ?? []
        const referenceList = imageTargets.length > 0 ? imageTargets : loadImages.map(item => ({ id: item.id, classType: 'LoadImage', field: 'image' }))
        const referenceValue = (node.referenceTarget ?? '').includes(':') ? node.referenceTarget : `${node.referenceTarget ?? ''}:image`
        const models = catalog.models.filter(entry => entry.provider === node.provider)
        const effortModel = catalog.models.find(entry => entry.provider === node.provider && entry.id === node.model)
        const toggle = (key, value) => patchNode(node.id, {
          [key]: (node[key] ?? []).includes(value) ? node[key].filter(item => item !== value) : [...(node[key] ?? []), value],
        })
        const tools = catalog.tools.filter(tool => toolQuery === '' || tool.name.toLowerCase().includes(toolQuery.toLowerCase()))
        return h(
          'div',
          { className: 'dsh-wf-inspector', onPointerDown: event => event.stopPropagation() },
          h(
            'h4',
            null,
            h('span', { className: 'dsh-wf-kind' }, node.type === 'model' ? t('wfModel') : node.type === 'exchange' ? t('wfExchange') : t('wfComfy')),
            h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, node.title),
            h(Button, {
              label: t('wfCloseEditor'),
              title: t('wfCloseEditor'),
              onClick: () => setEditing(''),
            }),
          ),
          h(WfField, { label: '标题' }, h('input', {
            className: 'dsh-wf-input',
            value: node.title,
            onChange: event => patchNode(node.id, { title: event.target.value }),
          })),
          node.type === 'model' || node.type === 'exchange'
            ? h(
              'div',
              { className: 'dsh-wf-row' },
              h(WfField, { label: 'Provider' }, h(
                'select',
                {
                  className: 'dsh-wf-select',
                  value: node.provider,
                  onChange: (event) => {
                    const provider = event.target.value
                    const first = catalog.models.find(entry => entry.provider === provider)
                    patchNode(node.id, { provider, model: first?.id ?? '' })
                  },
                },
                h('option', { value: '' }, '—'),
                catalog.providers.map(provider => h('option', { key: provider.id, value: provider.id }, provider.name)),
              )),
              h(WfField, { label: t('wfModel') }, h(
                'select',
                {
                  className: 'dsh-wf-select',
                  value: node.model,
                  onChange: event => patchNode(node.id, { model: event.target.value }),
                },
                h('option', { value: '' }, node.type === 'exchange' ? '继承第一个模型节点' : '—'),
                models.map(entry => h('option', { key: entry.id, value: entry.id }, entry.name)),
              )),
            )
            : null,
          node.type === 'model' || node.type === 'exchange'
            ? h(
              'div',
              { className: 'dsh-wf-row' },
              h(WfField, { label: '推理强度' }, h(
                'select',
                {
                  className: 'dsh-wf-select',
                  value: node.reasoningEffort ?? '',
                  onChange: event => patchNode(node.id, { reasoningEffort: event.target.value }),
                },
                h('option', { value: '' }, '默认'),
                (effortModel?.efforts ?? []).map(effort => h('option', { key: effort.id, value: effort.id }, effort.name)),
              )),
              h(WfField, { label: 'temperature' }, h('input', {
                className: 'dsh-wf-input',
                type: 'number',
                min: 0,
                max: 2,
                step: 0.1,
                value: node.temperature ?? '',
                onChange: event => patchNode(node.id, { temperature: event.target.value === '' ? undefined : Number(event.target.value) }),
              })),
            )
            : null,
          node.type === 'model'
            ? h(
              'div',
              null,
              h(WfField, { label: t('wfPrompt') }, h('textarea', {
                className: 'dsh-wf-area',
                rows: 6,
                value: node.prompt,
                placeholder: t('wfPromptHint'),
                onChange: event => patchNode(node.id, { prompt: event.target.value }),
              })),
              h('div', { className: 'dsh-wf-node-model' }, t('wfPromptHint')),
            )
            : null,
          node.type === 'exchange'
            ? h(
              'div',
              null,
              h(WfField, { label: t('wfExchangePrompt') }, h('textarea', {
                className: 'dsh-wf-area',
                rows: 7,
                value: node.prompt,
                placeholder: t('wfExchangeHint'),
                onChange: event => patchNode(node.id, { prompt: event.target.value }),
              })),
              h(WfField, { label: t('wfMode') }, h(
                'select',
                {
                  className: 'dsh-wf-select',
                  value: node.mode,
                  onChange: event => patchNode(node.id, { mode: event.target.value }),
                },
                h('option', { value: 'auto' }, t('wfModeAuto')),
                h('option', { value: 'fanout' }, t('wfModeFanout')),
              )),
              h('div', { className: 'dsh-wf-node-model' }, t('wfExchangeHint')),
            )
            : null,
          node.type === 'input' || node.type === 'leader'
            ? h(
              'div',
              null,
              h('div', { className: 'dsh-wf-node-model' }, node.type === 'leader' ? t('wfLeaderHint') : t('wfChatInputHint')),
              h(WfField, { label: t('wfChatInput') }, h('textarea', {
                className: 'dsh-wf-area',
                rows: 4,
                value: node.value ?? '',
                onChange: event => patchNode(node.id, { value: event.target.value }),
              })),
              h('label', { className: 'dsh-wf-check' },
                h('input', {
                  type: 'checkbox',
                  checked: node.autoRead !== false,
                  onChange: event => patchNode(node.id, { autoRead: event.target.checked }),
                }),
                h('span', null, t('wfAutoRead')),
              ),
              h('div', { className: 'dsh-wf-row' },
                h(Button, { label: t('wfReadNow'), onClick: () => void readChatInput() }),
              ),
            )
            : null,
          node.type === 'output'
            ? h(
              'div',
              null,
              h('div', { className: 'dsh-wf-node-model' }, t('wfOutputHint')),
              h('div', { className: 'dsh-wf-node-model' }, node.published === true ? `✓ ${t('wfPublished')}` : t('wfNotPublished')),
              h('div', { className: 'dsh-wf-row' },
                h(Button, {
                  label: t('wfResend'),
                  disabled: (node.output ?? '') === '',
                  onClick: () => void republishOutput(node),
                }),
              ),
            )
            : null,
          node.type === 'model'
            ? h(
              'div',
              null,
              h(WfField, { label: `${t('wfTools')}（${(node.tools ?? []).length}）` }, h('input', {
                className: 'dsh-wf-input',
                placeholder: '搜索工具…',
                value: toolQuery,
                onChange: event => setToolQuery(event.target.value),
              })),
              renderChecks(tools, node.tools ?? [], value => toggle('tools', value), tool => tool.name.startsWith('mcp__') ? 'MCP' : ''),
              h(WfField, { label: t('wfSkills') }, renderChecks(catalog.skills, node.skills ?? [], value => toggle('skills', value))),
              h(WfField, { label: t('wfMcps') }, renderChecks(
                catalog.mcps.map(server => ({ name: server.id })),
                node.mcps ?? [],
                value => toggle('mcps', value),
                server => `· ${catalog.tools.filter(tool => tool.name.startsWith(`mcp__${server.name}__`)).length} 个工具`,
              )),
            )
            : null,
          node.type === 'comfy'
            ? h(
              'div',
              { className: 'dsh-wf-row', style: { flexDirection: 'column', alignItems: 'stretch' } },
              h(WfField, { label: t('wfComfyUrl') }, h('input', {
                className: 'dsh-wf-input',
                value: node.baseUrl,
                onChange: event => patchNode(node.id, { baseUrl: event.target.value }),
              })),
              h(
                'div',
                { className: 'dsh-wf-row' },
                h(Button, { label: t('wfComfyCheck'), onClick: () => void checkComfy(node) }),
                h(Button, { label: t('wfComfyStart'), onClick: () => void startComfyBackend() }),
                h(Button, { label: t('wfComfyRefresh'), onClick: () => void refreshComfyWorkflows() }),
                h(Button, { label: t('wfCheckUpdates'), onClick: () => void refreshComfyWorkflows() }),
              ),
              h('div', { className: 'dsh-wf-node-model' }, comfy.status === null ? t('wfComfyNotReady') : t('wfComfyReady')),
              h('div', { className: 'dsh-wf-row' },
                h(Button, { label: t('wfViewGraph'), disabled: node.workflow === '', onClick: () => void openGraph(node.workflow) }),
              ),
              h(WfField, { label: t('wfComfyWorkflows') }, h(
                'select',
                {
                  className: 'dsh-wf-select',
                  value: node.workflow,
                  onChange: event => patchNode(node.id, { workflow: event.target.value }),
                },
                h('option', { value: '' }, '—'),
                comfy.workflows.map(item => h('option', {
                  key: item.name,
                  value: item.name,
                }, item.format === 'api' ? item.name : `${item.name} · UI→API`)),
              )),
              h(WfField, { label: t('wfTargetPositive') }, h(
                'select',
                {
                  className: 'dsh-wf-select',
                  value: node.positiveTarget ?? '',
                  onChange: event => patchNode(node.id, { positiveTarget: event.target.value }),
                },
                h('option', { value: '' }, positives.length > 0 ? '自动（所有文本编码节点）' : '无可选节点'),
                positives.map(item => h('option', { key: `${item.id}-${item.field}`, value: item.id }, `#${item.id} ${item.title} → ${item.field}`)),
              )),
              h(WfField, { label: t('wfPositive') }, h('textarea', {
                className: 'dsh-wf-area',
                rows: 2,
                value: node.promptText,
                onChange: event => patchNode(node.id, { promptText: event.target.value }),
              })),
              negatives.length > 0 || (node.negativeText ?? '') !== ''
                ? h(
                  'div',
                  null,
                  h(WfField, { label: t('wfTargetNegative') }, h(
                    'select',
                    {
                      className: 'dsh-wf-select',
                      value: node.negativeTarget ?? '',
                      onChange: event => patchNode(node.id, { negativeTarget: event.target.value }),
                    },
                    h('option', { value: '' }, negatives.length > 0 ? '自动（所有 negative_prompt）' : t('wfNoNegative')),
                    negatives.map(item => h('option', { key: `${item.id}-${item.field}`, value: item.id }, `#${item.id} ${item.title} → ${item.field}`)),
                  )),
                  h(WfField, { label: t('wfNegative') }, h('textarea', {
                    className: 'dsh-wf-area',
                    rows: 2,
                    value: node.negativeText ?? '',
                    onChange: event => patchNode(node.id, { negativeText: event.target.value }),
                  })),
                )
                : null,
              h(WfField, { label: t('wfReference') },
                h('div', { className: 'dsh-wf-row' },
                  h('input', {
                    className: 'dsh-wf-input',
                    type: 'file',
                    accept: 'image/png,image/jpeg,image/webp',
                    onChange: async (event) => {
                      const file = event.target.files?.[0]
                      if (file === undefined) return
                      try {
                        const data = await readBase64(file)
                        const result = await wfCall('comfy/upload', { method: 'POST', body: { sessionId, name: file.name, data } })
                        patchNode(node.id, { referenceImage: result.name })
                        setError('')
                      } catch (caught) {
                        setError(String(caught.message ?? caught))
                      }
                    },
                  }),
                  (node.referenceImage ?? '') !== ''
                    ? h(Button, { label: t('wfClear'), onClick: () => patchNode(node.id, { referenceImage: '' }) })
                    : null,
                ),
                (node.referenceImage ?? '') !== ''
                  ? h('img', {
                    className: 'dsh-wf-thumb',
                    src: `api/ai-workflow/comfy/view?sessionId=${encodeURIComponent(sessionId)}&baseUrl=${encodeURIComponent(node.baseUrl || '')}&filename=${encodeURIComponent(node.referenceImage)}&subfolder=&type=input`,
                    alt: t('wfReference'),
                  })
                  : null,
              ),
              referenceList.length > 0
                ? h(WfField, { label: t('wfTargetReference') }, h(
                  'select',
                  {
                    className: 'dsh-wf-select',
                    value: referenceValue,
                    onChange: event => patchNode(node.id, { referenceTarget: event.target.value }),
                  },
                  h('option', { value: '' }, '自动（第一个图像输入）'),
                  referenceList.map(item => h('option', { key: `${item.id}-${item.field}`, value: `${item.id}:${item.field}` }, `#${item.id} ${item.classType} → ${item.field}`)),
                ))
                : null,
              h('div', { className: 'dsh-wf-row' },
                h(Button, {
                  label: t('wfPreview'),
                  disabled: node.workflow === '',
                  onClick: async () => {
                    try {
                      const data = await wfCall('comfy/preview', { method: 'POST', body: { name: node.workflow, node } })
                      setComfyPreview(data.applied ?? [])
                      setError('')
                    } catch (caught) {
                      setError(String(caught.message ?? caught))
                    }
                  },
                }),
              ),
              comfyPreview !== null
                ? h(
                  'div',
                  { className: 'dsh-wf-checks' },
                  comfyPreview.length === 0
                    ? h('span', { className: 'dsh-wf-node-model' }, '没有字段被改写')
                    : comfyPreview.map(item => h(
                      'div',
                      { className: 'dsh-wf-check', key: item.id },
                      h('span', null, `#${item.id} ${item.class_type}: ${Object.entries(item.changes).map(([field, change]) => `${field}=${String(change.to).slice(0, 36)}`).join(' · ')}`),
                    )),
                )
                : null,
              h(
                'div',
                { className: 'dsh-wf-row' },
                h(WfField, { label: t('wfComfySeed') }, h('input', {
                  className: 'dsh-wf-input',
                  type: 'number',
                  value: node.seed ?? '',
                  onChange: event => patchNode(node.id, { seed: event.target.value === '' ? undefined : Number(event.target.value) }),
                })),
                h(WfField, { label: t('wfComfySize') }, h(
                  'div',
                  { className: 'dsh-wf-row' },
                  h('input', {
                    className: 'dsh-wf-input',
                    type: 'number',
                    style: { width: 72 },
                    value: node.width ?? '',
                    onChange: event => patchNode(node.id, { width: event.target.value === '' ? undefined : Number(event.target.value) }),
                  }),
                  h('span', null, '×'),
                  h('input', {
                    className: 'dsh-wf-input',
                    type: 'number',
                    style: { width: 72 },
                    value: node.height ?? '',
                    onChange: event => patchNode(node.id, { height: event.target.value === '' ? undefined : Number(event.target.value) }),
                  }),
                )),
              ),
              h(WfField, { label: t('wfComfyOverrides') }, h('textarea', {
                className: 'dsh-wf-area',
                rows: 3,
                value: JSON.stringify(node.overrides ?? {}, null, 2),
                onBlur: (event) => {
                  try {
                    const parsed = JSON.parse(event.target.value || '{}')
                    patchNode(node.id, { overrides: parsed !== null && typeof parsed === 'object' ? parsed : {} })
                    setError('')
                  } catch {
                    setError('overrides 不是合法 JSON')
                  }
                },
                onChange: () => undefined,
              })),
            )
            : null,
          h('div', { className: 'dsh-wf-row' }, h(Button, {
            label: t('wfDelete'),
            tone: 'danger',
            onClick: () => removeNode(node.id),
          })),
        )
      }

      const miniGraph = (ui) => {
        const laid = layoutLitegraph(ui ?? { nodes: [] })
        const bounds = laid.bounds
        return h(
          'svg',
          { className: 'dsh-wf-mini', viewBox: `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`, preserveAspectRatio: 'xMidYMid meet' },
          (ui?.links ?? []).map((link, index) => {
            if (!Array.isArray(link)) return null
            const from = laid.byId.get(String(link[1]))
            const to = laid.byId.get(String(link[3]))
            if (from === undefined || to === undefined) return null
            return h('line', {
              key: `l${index}`,
              x1: from.x + from.w,
              y1: from.y + from.h / 2,
              x2: to.x,
              y2: to.y + to.h / 2,
              stroke: 'var(--dsw-alias-border-l2)',
              strokeWidth: Math.max(4, bounds.width / 200),
            })
          }),
          [...laid.byId.values()].map(node => h('rect', {
            key: node.id,
            x: node.x,
            y: node.y,
            width: node.w,
            height: node.h,
            rx: 10,
            fill: nodeColor(node.type),
            'fill-opacity': 0.55,
            stroke: 'var(--dsw-alias-border-l1)',
            strokeWidth: Math.max(3, bounds.width / 260),
          })),
        )
      }

      const bigGraph = (data) => {
        const bounds = data?.bounds ?? { width: 900, height: 600 }
        const byId = new Map((data?.nodes ?? []).map(node => [node.id, node]))
        return h(
          'svg',
          { className: 'dsh-wf-biggraph', viewBox: `0 0 ${bounds.width} ${bounds.height}`, preserveAspectRatio: 'xMidYMid meet' },
          (data?.edges ?? []).map((edge, index) => {
            const a = byId.get(edge.from)
            const b = byId.get(edge.to)
            if (a === undefined || b === undefined) return null
            return h('path', {
              key: `e${index}`,
              d: `M ${a.x + a.w} ${a.y + a.h / 2} C ${a.x + a.w + 26} ${a.y + a.h / 2}, ${b.x - 26} ${b.y + b.h / 2}, ${b.x} ${b.y + b.h / 2}`,
              fill: 'none',
              stroke: 'var(--dsw-alias-border-l2)',
              strokeWidth: 2,
            })
          }),
          (data?.nodes ?? []).map(node => h(
            'g',
            { key: node.id },
            h('rect', {
              x: node.x,
              y: node.y,
              width: node.w,
              height: node.h,
              rx: 8,
              fill: 'var(--dsw-alias-bg-layer-2)',
              stroke: 'var(--dsw-alias-border-l2)',
            }),
            h('text', { x: node.x + 8, y: node.y + 17, fill: 'var(--dsw-alias-label-primary)', fontSize: 10, fontWeight: 600 }, node.title.slice(0, 24)),
            h('text', { x: node.x + 8, y: node.y + 30, fill: 'var(--dsw-alias-label-secondary)', fontSize: 8 }, `#${node.id}`),
            node.summary.slice(0, 3).map((line, index) => h('text', {
              key: `s${index}`,
              x: node.x + 8,
              y: node.y + 44 + index * 11,
              fill: 'var(--dsw-alias-label-secondary)',
              fontSize: 8,
            }, line.slice(0, 30))),
          )),
        )
      }

      const renderNode = (node) => {
        const runtime = node.status ?? 'idle'
        const expanded = isExpanded(node)
        const size = sizeOf(node)
        const comfyGraph = node.type === 'comfy' ? graphs[node.workflow] : undefined
        const comfyUi = node.type === 'comfy' ? (comfyRaw[node.workflow] ?? comfyGraph?.ui ?? null) : null
        return h(
          'div',
          {
            key: node.id,
            className: `dsh-wf-node ${selected === node.id ? 'sel' : ''} ${runtime === 'running' ? 'running' : runtime === 'error' ? 'error' : ''}`,
            'data-node-id': node.id,
            style: { left: node.x, top: node.y, width: size.w, ...(expanded ? { height: size.h } : {}) },
            onPointerDown: event => beginDrag(event, node),
            onContextMenu: (event) => {
              event.preventDefault()
              event.stopPropagation()
              setSelected(node.id)
              setEditing(node.id)
            },
          },
          h(
            'div',
            {
              className: 'dsh-wf-node-head',
              // ComfyUI paints a title bar per node category; the AI node kinds
              // follow the same palette.
              style: { background: typeColor(node.type) },
            },
            h('span', { className: `dsh-wf-dot ${runtime}` }),
            h('span', { className: 'dsh-wf-node-title' }, node.title || node.id),
            comfyGraph !== undefined
              ? h('span', { style: { flex: 'none' }, onPointerDown: event => event.stopPropagation() },
                h(Button, {
                  label: expanded ? '收起' : '展开',
                  title: expanded ? t('wfCollapse') : t('wfExpand'),
                  onClick: (event) => {
                    event.stopPropagation()
                    setCollapsed(current => ({ ...current, [node.id]: expanded }))
                  },
                }))
              : null,
            h('span', { className: 'dsh-wf-kind' }, node.type === 'model' ? 'MODEL' : node.type === 'exchange' ? 'EXCH' : node.type === 'input' ? 'INPUT' : node.type === 'output' ? 'OUTPUT' : node.type === 'leader' ? 'LEADER' : 'COMFY'),
          ),
          expanded
            ? h(
              'div',
              { className: 'dsh-wf-node-body', style: { padding: 6, gap: 5, flex: 1, minHeight: 0, overflow: 'hidden' } },
              h('div', { className: 'dsh-wf-node-model' }, `${node.workflow} · ${String(comfyGraph?.format ?? '').toUpperCase()} · ${(comfyUi?.nodes ?? []).length} 节点`),
              h('div', { style: { flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' } }, h(LiteGraphView, { ui: comfyUi, zoom: 1, highlight: highlightFor(node), onPick: pickTarget })),
            )
            : h(
              'div',
              { className: 'dsh-wf-node-body' },
              node.type === 'model'
                ? h('div', { className: 'dsh-wf-node-model' }, `${node.provider || '—'} / ${node.model || '—'}`)
                : node.type === 'exchange'
                  ? h('div', { className: 'dsh-wf-node-model' }, node.mode === 'fanout' ? t('wfModeFanout') : t('wfModeAuto'))
                  : node.type === 'leader'
                    ? h('div', { className: 'dsh-wf-node-model' }, t('wfLeaderTitle'))
                    : node.type === 'input'
                      ? h('div', { className: 'dsh-wf-node-model' }, t('wfChatInput'))
                      : node.type === 'output'
                        ? h('div', { className: 'dsh-wf-node-model' }, node.published === true ? t('wfPublished') : t('wfNotPublished'))
                        : h('div', { className: 'dsh-wf-node-model' }, node.workflow || '—'),
              h(
                'div',
                { className: 'dsh-wf-badges' },
                node.type === 'model' ? h('span', { className: 'dsh-wf-badge' }, `${t('wfTools')} ${(node.tools ?? []).length}`) : null,
                node.type === 'model' ? h('span', { className: 'dsh-wf-badge' }, `${t('wfSkills')} ${(node.skills ?? []).length}`) : null,
                node.type === 'model' ? h('span', { className: 'dsh-wf-badge' }, `MCP ${(node.mcps ?? []).length}`) : null,
                node.status === 'done' && node.ms > 0 ? h('span', { className: 'dsh-wf-badge' }, `${(node.ms / 1000).toFixed(1)}s`) : null,
              ),
              node.type === 'comfy' && comfyUi !== null ? miniGraph(comfyUi) : null,
              node.error !== '' && node.error !== undefined
                ? h('div', { className: 'dsh-wf-node-out', style: { color: 'var(--dsw-alias-state-error-primary)' } }, node.error)
                : h('div', { className: 'dsh-wf-node-out' }, node.output === '' || node.output === undefined ? '—' : node.output.slice(0, 220)),
              Array.isArray(node.images) && node.images.length > 0 && node.images[0].url !== undefined
                ? h('img', { className: 'dsh-wf-thumb', src: node.images[0].url, alt: t('wfImage') })
                : null,
            ),
          node.type === 'model'
            ? [
              port(node, 'in', t('wfInput'), 'left', portOffset(node, 'in')),
              port(node, 'exchange', t('wfExchange'), 'left', portOffset(node, 'exchange')),
              port(node, 'out', t('wfOutput'), 'right', portOffset(node, 'out')),
            ]
            : node.type === 'exchange'
              ? [
                port(node, 'in', t('wfInput'), 'left', portOffset(node, 'in')),
                port(node, 'out', t('wfDispatch'), 'right', portOffset(node, 'out')),
              ]
              : node.type === 'input'
                ? [port(node, 'out', t('wfOutput'), 'right', portOffset(node, 'out'))]
                : node.type === 'output'
                  ? [port(node, 'in', t('wfInput'), 'left', portOffset(node, 'in'))]
                  : node.type === 'leader'
                    ? [
                      // Two inputs (user message, member results) and one
                      // dispatch output keep the three pipelines distinct.
                      port(node, 'out', t('wfDispatch'), 'right', 46),
                      port(node, 'input', t('wfLeaderUserInput'), 'left', 38),
                      port(node, 'result', t('wfLeaderMembers'), 'left', 78),
                    ]
                    : [
                    port(node, 'in', t('wfPositive'), 'left', portOffset(node, 'in')),
                    port(node, 'negative', t('wfNegative'), 'left', portOffset(node, 'negative')),
                    port(node, 'image', t('wfReference'), 'left', portOffset(node, 'image')),
                    port(node, 'out', t('wfOutput'), 'right', portOffset(node, 'out')),
                  ],
        )
      }

      const port = (card, key, label, side, top) => h(
        'div',
        {
          key,
          className: `dsh-wf-port ${key}`,
          'data-node': card.id,
          'data-port': key,
          style: side === 'left'
            ? { left: -6, top: top - 5 }
            : { right: -6, top: top - 5 },
          title: label,
          onPointerDown: event => beginLink(event, card, key),
        },
        h('span', {
          className: 'dsh-wf-port-label',
          style: side === 'left'
            ? { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 5 }
            : { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 5 },
        }, label),
      )

      const openGraph = async (name) => {
        if (name === '') return
        let data = graphs[name]
        if (data === undefined) {
          try {
            data = await wfCall('comfy/json', { query: { name } })
            setGraphs(current => ({ ...current, [name]: data }))
          } catch (caught) {
            setError(String(caught.message ?? caught))
            return
          }
        }
        let raw = comfyRaw[name]
        if (raw === undefined) {
          raw = data.ui ?? null
          if (raw !== null) setComfyRaw(current => ({ ...current, [name]: raw }))
        }
        setGraphModal({ name, data, ui: raw, tab: 'graph', zoom: 1 })
      }

      /**
       * Highlight the nodes one ComfyUI-type graph node injects into.
       * @param {object} card - workflow node of type `comfy`.
       * @returns {string[]} node ids as strings.
       */
      const highlightFor = (card) => [card?.positiveTarget, card?.negativeTarget, String(card?.referenceTarget ?? '').split(':')[0]]
        .filter(value => value !== undefined && value !== null && value !== '')
        .map(String)

      /**
       * Make one clicked ComfyUI graph node the injection target.
       *
       * The node's own writable fields decide which of the three targets move:
       * a text-encode node takes the prompts, an image loader takes the
       * reference image, and anything else reports that it has no slot.
       * @param {string} id - ComfyUI node id inside the workflow.
       */
      const pickTarget = (id) => {
        const card = nodeById.get(editing === '' ? selected : editing)
        if (card === undefined || card.type !== 'comfy') return
        const catalog = targets[card.workflow] ?? {}
        const pos = (catalog.positives ?? []).find(item => String(item.id) === String(id))
        const neg = (catalog.negatives ?? []).find(item => String(item.id) === String(id))
        const img = (catalog.images ?? []).find(item => String(item.id) === String(id))
        const patch = {}
        if (pos !== undefined) patch.positiveTarget = String(id)
        if (neg !== undefined) patch.negativeTarget = String(id)
        if (img !== undefined) patch.referenceTarget = `${id}:${img.field}`
        if (Object.keys(patch).length === 0) {
          setNotice(`#${id} 没有可注入的提示词或参考图字段`)
          return
        }
        patchNode(card.id, patch)
        setNotice(`#${id} 已设为注入目标`)
      }

      const renderGraphModal = () => {
        const data = graphModal.data
        const nodes = data?.nodes ?? []
        const byId = new Map(nodes.map(node => [node.id, node]))
        const bounds = data?.bounds ?? { width: 900, height: 600 }
        const zoom = graphModal.zoom ?? 1
        return h(
          'div',
          { className: 'dsh-wf-modal', onPointerDown: event => event.stopPropagation() },
          h(
            'div',
            { className: 'dsh-wf-modal-card' },
            h(
              'div',
              { className: 'dsh-wf-modal-head' },
              h('span', { className: 'dsh-wf-modal-title' }, `${graphModal.name} · ${data?.format?.toUpperCase() ?? ''}`),
              h(Button, { label: t('wfGraph'), primary: graphModal.tab === 'graph', onClick: () => setGraphModal(current => ({ ...current, tab: 'graph' })) }),
              h(Button, { label: t('wfJson'), primary: graphModal.tab === 'json', onClick: () => setGraphModal(current => ({ ...current, tab: 'json' })) }),
              h(Button, { label: '−', title: t('wfZoomOut'), onClick: () => setGraphModal(current => ({ ...current, zoom: Math.max(0.4, (current.zoom ?? 1) / 1.2) })) }),
              h(Button, { label: '＋', title: t('wfZoomIn'), onClick: () => setGraphModal(current => ({ ...current, zoom: Math.min(3, (current.zoom ?? 1) * 1.2) })) }),
              h(Button, { label: t('wfCloseEditor'), onClick: () => setGraphModal(null) }),
            ),
            h(
              'div',
              { className: 'dsh-wf-modal-body' },
              graphModal.tab === 'json'
                ? h('pre', { className: 'dsh-wf-json' }, JSON.stringify(data?.json ?? {}, null, 2))
                : (graphModal.ui?.nodes ?? []).length === 0
                  ? h('div', { className: 'dsh-wf-node-model' }, t('wfGraphEmpty'))
                  : h(LiteGraphView, {
                    ui: graphModal.ui,
                    zoom,
                    highlight: highlightFor(nodeById.get(editing === '' ? selected : editing)),
                    onPick: (id) => {
                      pickTarget(id)
                      setGraphModal(current => current === null ? current : { ...current, picked: id })
                    },
                  }),
            ),
          ),
        )
      }

      const openNodeLib = async () => {
        setNodeLib(current => ({ ...current, open: true }))
        if (nodeLib.data !== null) return
        try {
          const data = await wfCall('comfy/nodes', { query: { sessionId, baseUrl: 'http://127.0.0.1:8188' } })
          setNodeLib({ open: true, data, error: '', query: nodeLib.query })
        } catch (caught) {
          setNodeLib(current => ({ ...current, error: String(caught.message ?? caught) }))
        }
      }

      const renderNodeLib = () => {
        const q = nodeLib.query.toLowerCase()
        const nodes = (nodeLib.data?.nodes ?? []).filter(node => q === '' || node.name.toLowerCase().includes(q) || node.category.toLowerCase().includes(q))
        return h(
          'div',
          { className: 'dsh-wf-modal', onPointerDown: event => event.stopPropagation() },
          h(
            'div',
            { className: 'dsh-wf-modal-card' },
            h(
              'div',
              { className: 'dsh-wf-modal-head' },
              h('span', { className: 'dsh-wf-modal-title' }, `${t('wfNodeLib')} · ${nodeLib.data?.total ?? 0}（${nodeLib.data?.source ?? ''}）`),
              h('input', {
                className: 'dsh-wf-input',
                style: { maxWidth: 240 },
                placeholder: '搜索节点…',
                value: nodeLib.query,
                onChange: event => setNodeLib(current => ({ ...current, query: event.target.value })),
              }),
              h(Button, { label: t('wfCloseEditor'), onClick: () => setNodeLib(current => ({ ...current, open: false })) }),
            ),
            h(
              'div',
              { className: 'dsh-wf-modal-body' },
              nodeLib.error !== '' ? h('div', { className: 'dsh-wf-node-model' }, nodeLib.error) : null,
              nodeLib.data === null && nodeLib.error === '' ? h('div', { className: 'dsh-wf-node-model' }, '…') : null,
              nodes.slice(0, 300).map(node => h(
                'div',
                { className: 'dsh-wf-mcp-row', key: node.name },
                h(
                  'main',
                  null,
                  h('span', { className: 'dsh-wf-mcp-name' }, node.name),
                  h('span', { className: 'dsh-wf-mcp-note' }, `${node.category} · ${(node.inputs ?? []).map(input => `${input.field}:${input.kind}`).slice(0, 6).join(', ')}`),
                ),
              )),
              nodes.length > 300 ? h('div', { className: 'dsh-wf-node-model' }, `仅显示前 300 / ${nodes.length}`) : null,
            ),
          ),
        )
      }

      const byId = nodeById
      const nodes = workflow?.nodes ?? []
      const edges = workflow?.edges ?? []
      const running = run !== null && run.status === 'running'

      return h(
        'div',
        { className: 'dsh-wf-root', 'data-aiwf': 'panel' },
        h('style', null, WF_CSS),
        h(
          'div',
          { className: 'dsh-wf-head' },
          h('span', { className: 'dsh-wf-title' }, t('wfTitle')),
          h(Button, { label: t('wfAddModel'), primary: true, onClick: () => addNode('model') }),
          h(Button, { label: t('wfAddLeader'), onClick: () => addNode('leader') }),
          h(Button, { label: t('wfAddInput'), onClick: () => addNode('input') }),
          h(Button, { label: t('wfAddOutput'), onClick: () => addNode('output') }),
          h(Button, { label: t('wfAddExchange'), onClick: () => addNode('exchange') }),
          h(Button, { label: t('wfAddComfy'), onClick: () => addNode('comfy') }),
          h(Button, { label: t('wfNodeLib'), onClick: () => void openNodeLib() }),
          h('span', { className: 'dsh-wf-sp' }),
          h(Button, { label: running ? t('wfStop') : t('wfRun'), tone: running ? 'danger' : 'primary', disabled: workflow === null || nodes.length === 0 || sessionId === '', onClick: () => { void (running ? stopRun() : startRun()) } }),
          h(Button, {
            label: t('tabTitle'),
            title: t('tabTitle'),
            onClick: () => {
              const sidebar = typeof ctx.get === 'function' ? ctx.get('sidebarRight') : ctx.sidebarRight
              if (typeof sidebar?.openTab === 'function') sidebar.openTab(TAB_KIND)
            },
          }),
          h('span', { className: 'dsh-wf-pill' }, saving ? t('wfSaving') : (notice || t('wfSaved'))),
          running ? h('span', { className: 'dsh-wf-pill run' }, t('wfRunRunning')) : null,
        ),
        error === '' ? null : h('div', { className: 'dsh-wf-error' }, error),
        sessionId === ''
          ? h('div', { className: 'dsh-wf-empty' }, h('strong', null, t('wfNoSession')))
          : h(
            'div',
            {
              className: 'dsh-wf-canvas',
              ref: canvasRef,
              onPointerDown: (event) => {
                setEdgeMenu(null)
                beginPan(event)
              },
              // The dot grid shares the world transform: spacing scales with
              // the zoom, origin follows the pan, so the dots move with the
              // mouse and the nodes never drift off the grid.
              style: {
                backgroundSize: `${18 * view.k}px ${18 * view.k}px`,
                backgroundPosition: `${view.x}px ${view.y}px`,
              },
            },
            workflow === null
              ? h('div', { className: 'dsh-wf-empty' }, '…')
              : h(
                'div',
                {
                  className: 'dsh-wf-world',
                  style: { transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` },
                },
                h(
                  'svg',
                  { className: 'dsh-wf-svg', width: 6000, height: 6000 },
                  edges.map((edge) => {
                    const a = portPoint(edge.from.node, edge.from.port)
                    const b = portPoint(edge.to.node, edge.to.port)
                    const path = `M ${a.x} ${a.y} C ${a.x + 70} ${a.y}, ${b.x - 70} ${b.y}, ${b.x} ${b.y}`
                    // Each pipeline gets its own color, like ComfyUI colors a
                    // link by the socket it leaves from.
                    const stroke = linkColor(portSocketType(edge))
                    return h(
                      'g',
                      { key: edge.id },
                      h('path', {
                        className: 'dsh-wf-edge-hit',
                        d: path,
                        onPointerDown: event => event.stopPropagation(),
                        onContextMenu: (event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          const host = canvasRef.current?.getBoundingClientRect()
                          setEdgeMenu({
                            id: edge.id,
                            x: event.clientX - (host?.left ?? 0),
                            y: event.clientY - (host?.top ?? 0),
                            label: `${byId.get(edge.from.node)?.title || edge.from.node} → ${byId.get(edge.to.node)?.title || edge.to.node}`,
                          })
                        },
                      }),
                      h('path', { className: 'dsh-wf-edge', d: path, style: { stroke, strokeWidth: 2.4 } }),
                    )
                  }),
                  link === null ? null : (() => {
                    const a = portPoint(link.from.node, link.from.port)
                    return h('path', {
                      className: 'dsh-wf-edge-live',
                      d: `M ${a.x} ${a.y} C ${a.x + 70} ${a.y}, ${link.x - 70} ${link.y}, ${link.x} ${link.y}`,
                    })
                  })(),
                ),
                workflow.nodes.length === 0
                  ? h('div', { className: 'dsh-wf-empty' }, h('strong', null, t('wfEmpty')), h('span', null, t('wfEmptyHint')))
                  : workflow.nodes.map(node => renderNode(node)),
              ),
          ),
        edgeMenu === null
          ? null
          : h(
            'div',
            {
              className: 'dsh-wf-menu',
              style: { left: Math.max(4, edgeMenu.x), top: Math.max(4, edgeMenu.y) },
              onPointerDown: event => event.stopPropagation(),
              onContextMenu: event => event.preventDefault(),
            },
            h('div', { className: 'dsh-wf-menu-title' }, edgeMenu.label ?? ''),
            h(Button, {
              label: t('wfDeleteEdge'),
              tone: 'danger',
              onClick: () => {
                removeEdge(edgeMenu.id)
                setEdgeMenu(null)
              },
            }),
            h(Button, { label: t('wfCancel'), onClick: () => setEdgeMenu(null) }),
          ),
        editingNode === undefined ? null : renderInspector(),
        h(
          'div',
          { className: 'dsh-wf-foot' },
          h('span', null, `${workflow?.nodes.length ?? 0} 节点 · ${workflow?.edges.length ?? 0} 连线 · ${view.k.toFixed(2)}×`),
          h('span', { className: 'dsh-wf-sp' }),
          h('span', null, t('wfHint')),
        ),
        sessionId === ''
          ? null
          : null,
        graphModal !== null ? renderGraphModal() : null,
        nodeLib.open ? renderNodeLib() : null,
      )
    }

    /* ---------------------------------------------------------------- *
     * MCP library button (composer tool row)
     * ---------------------------------------------------------------- */

    /** Styles for the composer button and its floating list. */
    const MCP_STYLES = `
      .ttl-mcp-wrap { position: relative; display: inline-flex; }
      .ttl-mcp-btn {
        display: inline-flex; align-items: center; gap: 5px;
        height: 26px; padding: 0 8px; border-radius: 7px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.14));
        background: var(--dsw-alias-bg-layer-2, #f7f7f7);
        color: var(--dsw-alias-label-primary, #1f1f1f);
        font: inherit; font-size: 12px; cursor: pointer;
      }
      .ttl-mcp-btn[aria-expanded="true"] {
        border-color: var(--dsw-alias-state-accent-primary, #4a6cf7);
        color: var(--dsw-alias-state-accent-primary, #4a6cf7);
      }
      .ttl-mcp-btn:disabled { opacity: .6; cursor: default; }
      .ttl-mcp-count {
        min-width: 15px; height: 15px; padding: 0 4px; border-radius: 8px;
        background: var(--dsw-alias-bg-layer-3, #e8e8e8);
        color: var(--dsw-alias-label-secondary, #6b6b6b);
        font-size: 10px; line-height: 15px; text-align: center;
      }
      .ttl-mcp-panel {
        position: fixed; z-index: 60; width: 372px; max-width: calc(100vw - 24px);
        max-height: min(60vh, 420px); overflow: hidden; display: flex; flex-direction: column;
        border-radius: 12px; border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.1));
        background: var(--dsw-alias-bg-layer-1, #fff);
        color: var(--dsw-alias-label-primary, #1f1f1f);
        box-shadow: 0 14px 36px rgba(0,0,0,.18);
        font-size: 12px;
      }
      .ttl-mcp-head { padding: 10px 12px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.08)); }
      .ttl-mcp-title { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
      .ttl-mcp-title-text { font-weight: 600; font-size: 13px; }
      .ttl-mcp-title-meta { font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
      .ttl-mcp-hint { margin-top: 3px; font-size: 11px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
      .ttl-mcp-list { overflow: auto; padding: 4px; }
      .ttl-mcp-row {
        display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
        padding: 7px 9px; border-radius: 8px;
      }
      .ttl-mcp-row:hover { background: var(--dsw-alias-bg-layer-2, #f4f4f4); }
      .ttl-mcp-id { font-weight: 600; font-size: 12px; }
      .ttl-mcp-cmd {
        font-size: 10px; color: var(--dsw-alias-label-secondary, #6b6b6b);
        margin-top: 2px; word-break: break-all; line-height: 1.35;
      }
      .ttl-mcp-pill {
        flex: none; padding: 1px 6px; border-radius: 999px; font-size: 10px; line-height: 16px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.12));
        color: var(--dsw-alias-label-secondary, #6b6b6b);
        white-space: nowrap;
      }
      .ttl-mcp-pill[data-state="mounted"] { color: #1a7f37; border-color: rgba(26,127,55,.35); }
      .ttl-mcp-pill[data-state="mirrored"] { color: #8a6d00; border-color: rgba(138,109,0,.35); }
      .ttl-mcp-pill[data-state="pending"] { color: #b3541e; border-color: rgba(179,84,30,.35); }
      .ttl-mcp-pill[data-state="disabled"] { opacity: .75; }
      .ttl-mcp-foot {
        padding: 7px 12px; border-top: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.08));
        font-size: 10.5px; color: var(--dsw-alias-label-secondary, #6b6b6b);
        word-break: break-all; line-height: 1.4;
      }
      .ttl-mcp-err { color: var(--dsw-alias-state-error-primary, #c0392b); }
      .ttl-mcp-empty { padding: 12px; color: var(--dsw-alias-label-secondary, #6b6b6b); }
      .ttl-mcp-main { min-width: 0; flex: 1; }
      .ttl-mcp-actions { display: flex; align-items: center; gap: 8px; flex: none; }
      .ttl-mcp-section + .ttl-mcp-section { border-top: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.08)); }
      .ttl-mcp-section-head {
        padding: 8px 10px 4px; font-size: 10.5px; font-weight: 600;
        letter-spacing: .05em; color: var(--dsw-alias-label-secondary, #6b6b6b);
      }
      .ttl-mcp-switch {
        position: relative; flex: none; width: 30px; height: 16px; padding: 0;
        border-radius: 9px; border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.2));
        background: var(--dsw-alias-bg-layer-3, #dcdcdc); cursor: pointer;
        transition: background .12s, border-color .12s;
      }
      .ttl-mcp-switch[aria-checked="true"] {
        background: #1a7f37; border-color: #1a7f37;
      }
      .ttl-mcp-switch[data-locked="true"] { opacity: .35; cursor: default; }
      .ttl-mcp-switch:disabled { cursor: default; }
      .ttl-mcp-knob {
        position: absolute; top: 1px; left: 1px; width: 12px; height: 12px;
        border-radius: 50%; background: #fff; transition: left .12s;
        box-shadow: 0 1px 2px rgba(0,0,0,.25);
      }
      .ttl-mcp-switch[aria-checked="true"] .ttl-mcp-knob { left: 15px; }
    `

    /** One composer button listing every MCP in the shared library. */
    function McpLibraryButton(props) {
      const t = props.t
      const [open, setOpen] = React.useState(false)
      const [data, setData] = React.useState(null)
      const [error, setError] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [busyId, setBusyId] = React.useState('')
      const [pos, setPos] = React.useState({ left: 0, bottom: 0 })
      const wrapRef = React.useRef(null)

      const load = React.useCallback(async () => {
        setBusy(true)
        setError('')
        try {
          const payload = await call('library')
          setData(payload)
        } catch (failure) {
          setError(String(failure && failure.message ? failure.message : failure))
          setData(null)
        } finally {
          setBusy(false)
        }
      }, [])

      const place = React.useCallback(() => {
        const node = wrapRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        setPos({ left: Math.round(rect.left), bottom: Math.round(window.innerHeight - rect.top + 8) })
      }, [])

      const toggle = React.useCallback(() => {
        if (open) { setOpen(false); return }
        place()
        setOpen(true)
        void load()
      }, [open, place, load])

      React.useEffect(() => {
        if (!open) return undefined
        const onPointerDown = (event) => {
          if (wrapRef.current && wrapRef.current.contains(event.target)) return
          const panel = document.getElementById('dsh-mcp-library-panel')
          if (panel && panel.contains(event.target)) return
          setOpen(false)
        }
        const onKeyDown = (event) => { if (event.key === 'Escape') setOpen(false) }
        document.addEventListener('mousedown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown, true)
        window.addEventListener('resize', place)
        window.addEventListener('scroll', place, true)
        return () => {
          document.removeEventListener('mousedown', onPointerDown, true)
          document.removeEventListener('keydown', onKeyDown, true)
          window.removeEventListener('resize', place)
          window.removeEventListener('scroll', place, true)
        }
      }, [open, place])

      const servers = Array.isArray(data && data.mcp) ? data.mcp : []
      const mounted = Array.isArray(data && data.mounted) ? data.mounted : []
      const mirrored = Array.isArray(data && data.mirrored) ? data.mirrored : []
      const enabledCount = servers.filter(server => server.enabled !== false).length
      const loadedServers = servers.filter(server => mounted.indexOf(server.id) >= 0)
      const availableServers = servers.filter(server => mounted.indexOf(server.id) < 0)

      /** Status pill for one server. */
      const stateOf = (server) => {
        if (mirrored.indexOf(server.id) >= 0) return ['mirrored', t('mcpMirrored')]
        if (mounted.indexOf(server.id) >= 0) return ['mounted', t('mcpMounted')]
        if (server.enabled === false) return ['disabled', t('mcpDisabled')]
        return ['pending', t('mcpPending')]
      }

      const detailOf = (server) => {
        if (server.transport === 'streamable-http') return server.url || 'http'
        const args = Array.isArray(server.args) ? server.args.join(' ') : ''
        return `${server.command || ''}${args === '' ? '' : ` ${args}`}`.trim() || 'stdio'
      }

      /** Load or unload one library server; the Host remounts immediately. */
      const toggleServer = async (server) => {
        const isLoaded = mounted.indexOf(server.id) >= 0
        setBusyId(server.id)
        setError('')
        try {
          await call('library/mcp', { method: 'POST', body: { action: isLoaded ? 'disable' : 'enable', id: server.id } })
          await load()
        } catch (failure) {
          setError(String(failure && failure.message ? failure.message : failure))
        } finally {
          setBusyId('')
        }
      }

      /** One row: identity, status, and a load/unload switch. */
      const rowOf = (server) => {
        const status = stateOf(server)
        const isMirrored = mirrored.indexOf(server.id) >= 0
        const isLoaded = mounted.indexOf(server.id) >= 0
        const isBusy = busyId === server.id
        return h('div', {
          key: server.id,
          className: 'ttl-mcp-row',
          'data-mcp-id': server.id,
          'data-state': status[0],
          'data-loaded': isLoaded ? 'true' : 'false',
        },
          h('div', { className: 'ttl-mcp-main' },
            h('div', { className: 'ttl-mcp-id' }, server.id),
            h('div', { className: 'ttl-mcp-cmd' }, `${server.transport || 'stdio'} · ${detailOf(server)}`),
          ),
          h('div', { className: 'ttl-mcp-actions' },
            h('span', { className: 'ttl-mcp-pill', 'data-state': status[0] }, status[1]),
            h('button', {
              type: 'button',
              className: 'ttl-mcp-switch',
              role: 'switch',
              'aria-checked': isLoaded,
              'aria-label': `${isLoaded ? t('mcpUnload') : t('mcpLoad')} ${server.id}`,
              'data-locked': isMirrored ? 'true' : 'false',
              disabled: isMirrored || isBusy,
              title: isMirrored ? t('mcpProfileOwned') : (isLoaded ? t('mcpUnload') : t('mcpLoad')),
              onClick: () => { if (!isMirrored && !isBusy) void toggleServer(server) },
            }, h('span', { className: 'ttl-mcp-knob' })),
          ),
        )
      }

      return h('div', { className: 'ttl-mcp-wrap', ref: wrapRef, 'data-dsh-mcp-library': 'button' },
        h('style', null, MCP_STYLES),
        h('button', {
          type: 'button',
          className: 'ttl-mcp-btn',
          'aria-expanded': open,
          title: t('mcpLibraryHint'),
          onClick: toggle,
        },
          h('span', null, t('mcpLibrary')),
          h('span', { className: 'ttl-mcp-count' }, String(data ? servers.length : '')),
        ),
        open ? h('div', {
          className: 'ttl-mcp-panel',
          id: 'dsh-mcp-library-panel',
          'data-dsh-mcp-library': 'panel',
          style: { left: pos.left + 'px', bottom: pos.bottom + 'px' },
        },
          h('div', { className: 'ttl-mcp-head' },
            h('div', { className: 'ttl-mcp-title' },
              h('span', { className: 'ttl-mcp-title-text' }, t('mcpLibraryHint')),
              h('span', { className: 'ttl-mcp-title-meta' }, data ? `${loadedServers.length} ${t('mcpLoaded')} / ${availableServers.length} ${t('mcpAvailable')}` : (busy ? t('mcpLoading') : '')),
            ),
            h('div', { className: 'ttl-mcp-hint' }, data ? `${enabledCount}/${servers.length} ${t('mcpEnabled')}` : ''),
          ),
          h('div', { className: 'ttl-mcp-list' },
            error ? h('div', { className: 'ttl-mcp-empty ttl-mcp-err' }, `${t('mcpFailed')}: ${error}`) : null,
            !error && data === null ? h('div', { className: 'ttl-mcp-empty' }, t('mcpLoading')) : null,
            !error && data !== null && servers.length === 0 ? h('div', { className: 'ttl-mcp-empty' }, `${t('mcpEmpty')} · ${t('mcpRoot')}: ${String(data.root || '')}`) : null,
            !error && servers.length > 0 ? h('div', { className: 'ttl-mcp-section', 'data-section': 'loaded' },
              h('div', { className: 'ttl-mcp-section-head' }, `${t('mcpLoaded')} · ${loadedServers.length}`),
              loadedServers.length === 0
                ? h('div', { className: 'ttl-mcp-empty' }, t('mcpNoneLoaded'))
                : loadedServers.map(rowOf),
            ) : null,
            !error && servers.length > 0 ? h('div', { className: 'ttl-mcp-section', 'data-section': 'available' },
              h('div', { className: 'ttl-mcp-section-head' }, `${t('mcpAvailable')} · ${availableServers.length}`),
              availableServers.length === 0
                ? h('div', { className: 'ttl-mcp-empty' }, t('mcpAllLoaded'))
                : availableServers.map(rowOf),
            ) : null,
          ),
          h('div', { className: 'ttl-mcp-foot' },
            h('div', null, `${t('mcpRoot')}: ${String((data && data.root) || '')}`),
            busy ? h('div', null, t('mcpLoading')) : null,
          ),
        ) : null,
      )
    }

    
    /* ---------------------------------------------------------------- *
     * Edge pill
     * ---------------------------------------------------------------- */

    /**
     * Mount the pill on the right edge of the window; clicking it opens the
     * canvas tab. The right sidebar only shows tabs that are already open, so
     * the plugin needs its own opener.
     * @param {object} ctx - client plugin context.
     * @param {Function} t - translator.
     * @returns {Function} cleanup.
     */
    function mountWorkflowButton(ctx, t) {
      if (typeof document === 'undefined' || document.body === null) return () => undefined
      for (const stale of Array.from(document.querySelectorAll('[data-dsh-aiwf="pill"]'))) stale.remove()

      const button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('data-dsh-aiwf', 'pill')
      button.setAttribute('aria-label', t('wfTitle'))
      button.title = t('wfTitle')
      button.style.cssText = [
        'position:fixed',
        'right:0',
        'top:50%',
        'transform:translateY(-50%)',
        'z-index:2147482000',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'gap:5px',
        'padding:9px 5px',
        'border:1px solid var(--dsw-alias-border-l1)',
        'border-right:none',
        'border-radius:9px 0 0 9px',
        'background:var(--dsw-alias-bg-layer-1)',
        'color:var(--dsw-alias-label-secondary)',
        'cursor:pointer',
        'font:inherit',
      ].join(';')
      button.innerHTML = [
        '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">',
        '<rect x="1" y="2" width="6" height="5" rx="1.4" fill="currentColor"/>',
        '<rect x="1" y="9" width="6" height="5" rx="1.4" fill="currentColor" opacity=".7"/>',
        '<rect x="9.5" y="4.5" width="5.5" height="7" rx="1.6" stroke="currentColor" stroke-width="1.3"/>',
        '<path d="M7 4.5h1.4M7 11.5h1.4" stroke="currentColor" stroke-width="1.2"/>',
        '</svg>',
        '<span style="writing-mode:vertical-rl;font-size:10.5px;letter-spacing:.14em;line-height:1">',
        '</span>',
      ].join('')
      const label = button.querySelector('span')
      if (label !== null) label.textContent = t('wfTitle')

      button.addEventListener('click', () => {
        const sidebar = typeof ctx.get === 'function' ? ctx.get('sidebarRight') : ctx.sidebarRight
        try {
          if (sidebar !== undefined && sidebar !== null && typeof sidebar.openTab === 'function') {
            sidebar.openTab(TAB_KIND)
            return
          }
        } catch {
          /* fall through to revealing the column */
        }
        try {
          ctx.layout.openRightbar(true, false)
        } catch {
          /* nothing else to try */
        }
      })

      document.body.appendChild(button)
      return () => button.remove()
    }


    /* ---------------------------------------------------------------- *
     * Plugin
     * ---------------------------------------------------------------- */

    return {
      inject: ['slots', 'sidebarRightTabs', 'locale'],
      apply(ctx) {
        const dictionaries = { en: EN, zh: ZH }
        let translate = key => ZH[key] ?? EN[key] ?? key
        try {
          ctx.locale.register(NS, dictionaries)
          const bound = ctx.locale.bind(NS)
          if (typeof bound === 'function') translate = key => bound(key) ?? ZH[key] ?? EN[key] ?? key
          else {
            const locale = typeof ctx.locale.getLocale === 'function' ? ctx.locale.getLocale() : undefined
            const id = String(locale?.id ?? locale ?? '')
            translate = key => (id.startsWith('zh') ? ZH[key] : EN[key]) ?? key
          }
        } catch {
          /* keep the built-in fallback table */
        }
        const t = key => {
          try {
            const value = translate(key)
            return typeof value === 'string' && value !== '' ? value : (ZH[key] ?? EN[key] ?? key)
          } catch {
            return ZH[key] ?? EN[key] ?? key
          }
        }

        ctx.effect(() => ctx.sidebarRightTabs.register({
          id: TAB_ID,
          kind: TAB_KIND,
          title: () => t('wfTitle'),
          guide: [
            {
              id: TAB_KIND,
              order: 62,
              title: () => t('wfTitle'),
              description: () => t('wfHint'),
            },
          ],
        }), 'ai-workflow: tab type')

        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
          { name: 'sidebar.right.pane.tab', key: TAB_ID },
          props => h(PanelBoundary, { title: t('wfCrashTitle') }, h(WorkflowPanel, { ...props, t, ctx })),
        )), 'ai-workflow: panel body')

        ctx.effect(() => mountWorkflowButton(ctx, t), 'ai-workflow: edge pill')
      },
    }
  },
})
