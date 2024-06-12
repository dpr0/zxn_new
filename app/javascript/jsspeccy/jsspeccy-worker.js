(() => {
  'use strict'
  class e {
    constructor (e, t) {this.pulseLength = e, this.pulseCount = t, this.pulsesGenerated = 0}
    isFinished () {return this.pulsesGenerated == this.pulseCount}
    getNextPulseLength () {return this.pulsesGenerated++, this.pulseLength}
  }
  class t {
    constructor (e) {this.pulses = e, this.index = 0}
    isFinished () {return this.index == this.pulses.length}
    getNextPulseLength () {return this.pulses[this.index++]}
  }
  class s {
    constructor (e, t, s, n) {this.data = e, this.zeroPulseLength = t, this.onePulseLength = s, this.bitCount = 8 * (this.data.length - 1) + n, this.pulsesOutput = 0, this.lastPulseLength = null}
    isFinished () {return this.pulsesOutput == 2 * this.bitCount}
    getNextPulseLength () {
      if (1 & this.pulsesOutput) return this.pulsesOutput++, this.lastPulseLength
      {
        const e = this.pulsesOutput >> 1, t = e >> 3, s = 1 << 7 - (7 & e)
        return this.lastPulseLength = this.data[t] & s ? this.onePulseLength : this.zeroPulseLength, this.pulsesOutput++, this.lastPulseLength
      }
    }
  }
  class n {
    constructor (e) {this.duration = e, this.emitted = !1}
    isFinished () {return this.emitted}
    getNextPulseLength () {return this.emitted = !0, 3500 * this.duration}
  }
  class a {
    constructor (e) {this.segments = [], this.getSegments = e, this.level = 0, this.tapeIsFinished = !1, this.pendingCycles = 0}
    addSegment (e) {this.segments.push(e)}
    emitPulses (e, t, s) {
      let n = 0, a = t, i = !1
      for (; n < s;) if (this.pendingCycles > 0) this.pendingCycles >= 32768 ? (e[a++] = 32767 | this.level, n += 32767, this.pendingCycles -= 32767) : (e[a++] = this.level | this.pendingCycles, n += this.pendingCycles, this.pendingCycles = 0)
      else if (0 === this.segments.length) {
        if (this.tapeIsFinished) {
          i = !0
          break
        }
        this.tapeIsFinished = !this.getSegments(this)
      } else this.segments[0].isFinished() ? this.segments.shift() : (this.pendingCycles = this.segments[0].getNextPulseLength(), this.level ^= 32768)
      return [a, n, i]
    }
  }
  class i {
    constructor (i) {
      let r = 0
      this.blocks = []
      for (var o = new DataView(i); r + 1 < i.byteLength;) {
        const e = o.getUint16(r, !0)
        r += 2, this.blocks.push(new Uint8Array(i, r, e)), r += e
      }
      this.nextBlockIndex = 0, this.pulseGenerator = new a((a => {
        if (0 === this.blocks.length) return !1
        const i = this.blocks[this.nextBlockIndex]
        return this.nextBlockIndex = (this.nextBlockIndex + 1) % this.blocks.length, 128 & i[0] ? a.addSegment(new e(2168, 3223)) : a.addSegment(new e(2168, 8063)), a.addSegment(new t([667, 735])), a.addSegment(new s(i, 855, 1710, 8)), a.addSegment(new n(1e3)), 0 != this.nextBlockIndex
      }))
    }
    getNextLoadableBlock () {
      if (0 === this.blocks.length) return null
      const e = this.blocks[this.nextBlockIndex]
      return this.nextBlockIndex = (this.nextBlockIndex + 1) % this.blocks.length, e
    }
    static isValid (e) {
      let t = 0
      const s = new DataView(e)
      for (; t < e.byteLength;) {
        if (t + 1 >= e.byteLength) return !1
        t += s.getUint16(t, !0) + 2
      }
      return t == e.byteLength
    }
  }
  class r {
    static isValid (e) {
      const t = new DataView(e), s = 'ZXTape!'
      for (let e = 0; e < s.length; e++) if (s.charCodeAt(e) != t.getUint8(e)) return !1
      return !0
    }
    constructor (i) {
      this.blocks = []
      const r = new DataView(i)
      let o = 10
      for (; o < i.byteLength;) {
        const a = r.getUint8(o)
        switch (o++, a) {
          case 16:
            (() => {
              const a = r.getUint16(o, !0)
              o += 2
              const l = r.getUint16(o, !0)
              o += 2
              const c = new Uint8Array(i, o, l)
              this.blocks.push({
                type: 'StandardSpeedData',
                pause: a,
                data: c,
                generatePulses: i => {128 & c[0] ? i.addSegment(new e(2168, 3223)) : i.addSegment(new e(2168, 8063)), i.addSegment(new t([667, 735])), i.addSegment(new s(c, 855, 1710, 8)), a && i.addSegment(new n(a))}
              }), o += l
            })()
            break
          case 17:
            (() => {
              const a = r.getUint16(o, !0)
              o += 2
              const l = r.getUint16(o, !0)
              o += 2
              const c = r.getUint16(o, !0)
              o += 2
              const h = r.getUint16(o, !0)
              o += 2
              const u = r.getUint16(o, !0)
              o += 2
              const d = r.getUint16(o, !0)
              o += 2
              const g = r.getUint8(o)
              o += 1
              const p = r.getUint16(o, !0)
              o += 2
              const k = r.getUint16(o, !0) | r.getUint8(o + 2) << 16
              o += 3
              const f = new Uint8Array(i, o, k)
              this.blocks.push({
                type: 'TurboSpeedData',
                pilotPulseLength: a,
                syncPulse1Length: l,
                syncPulse2Length: c,
                zeroBitLength: h,
                oneBitLength: u,
                pilotPulseCount: d,
                lastByteMask: g,
                pause: p,
                data: f,
                generatePulses: i => {i.addSegment(new e(a, d)), i.addSegment(new t([l, c])), i.addSegment(new s(f, h, u, g)), p && i.addSegment(new n(p))}
              }), o += k
            })()
            break
          case 18:
            (() => {
              const t = r.getUint16(o, !0)
              o += 2
              const s = r.getUint16(o, !0)
              o += 2, this.blocks.push({
                type: 'PureTone',
                pulseLength: t,
                pulseCount: s,
                generatePulses: n => {n.addSegment(new e(t, s))}
              })
            })()
            break
          case 19:
            (() => {
              const e = r.getUint8(o)
              o += 1
              const s = []
              for (let t = 0; t < e; t++) s[t] = r.getUint16(o + 2 * t, !0)
              this.blocks.push({
                type: 'PulseSequence',
                pulseLengths: s,
                generatePulses: e => {e.addSegment(new t(s))}
              }), o += 2 * e
            })()
            break
          case 20:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2
              const t = r.getUint16(o, !0)
              o += 2
              const a = r.getUint8(o)
              o += 1
              const l = r.getUint16(o, !0)
              o += 2
              const c = r.getUint16(o, !0) | r.getUint8(o + 2) << 16
              o += 3
              const h = new Uint8Array(i, o, c)
              this.blocks.push({
                type: 'PureData',
                zeroBitLength: e,
                oneBitLength: t,
                lastByteMask: a,
                pause: l,
                data: h,
                generatePulses: i => {i.addSegment(new s(h, e, t, a)), l && i.addSegment(new n(l))}
              }), o += c
            })()
            break
          case 21:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2
              const t = r.getUint16(o, !0)
              o += 2
              const s = r.getUint8(o)
              o += 1
              const n = r.getUint16(o, !0) | r.getUint8(o + 2) << 16
              o += 3, this.blocks.push({
                type: 'DirectRecording',
                tstatesPerSample: e,
                lastByteMask: s,
                pause: t,
                data: new Uint8Array(i, o, n)
              }), o += n
            })()
            break
          case 32:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2, this.blocks.push({ type: 'Pause', pause: e, generatePulses: t => {t.addSegment(new n(e))} })
            })()
            break
          case 33:
            (() => {
              const e = r.getUint8(o)
              o += 1
              const t = new Uint8Array(i, o, e)
              o += e
              const s = String.fromCharCode.apply(null, t)
              this.blocks.push({ type: 'GroupStart', name: s })
            })()
            break
          case 34:
            (() => {this.blocks.push({ type: 'GroupEnd' })})()
            break
          case 35:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2, this.blocks.push({ type: 'JumpToBlock', offset: e })
            })()
            break
          case 36:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2, this.blocks.push({ type: 'LoopStart', repeatCount: e })
            })()
            break
          case 37:
            (() => {this.blocks.push({ type: 'LoopEnd' })})()
            break
          case 38:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2
              const t = []
              for (let s = 0; s < e; s++) t[s] = r.getUint16(o + 2 * s, !0)
              this.blocks.push({ type: 'CallSequence', offsets: t }), o += 2 * e
            })()
            break
          case 39:
            (() => {this.blocks.push({ type: 'ReturnFromSequence' })})()
            break
          case 40:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2, this.blocks.push({ type: 'Select', data: new Uint8Array(i, o, e) }), o += e
            })()
            break
          case 48:
            (() => {
              const e = r.getUint8(o)
              o += 1
              const t = new Uint8Array(i, o, e)
              o += e
              const s = String.fromCharCode.apply(null, t)
              this.blocks.push({ type: 'TextDescription', text: s })
            })()
            break
          case 49:
            (() => {
              const e = r.getUint8(o)
              o += 1
              const t = r.getUint8(o)
              o += 1
              const s = new Uint8Array(i, o, t)
              o += t
              const n = String.fromCharCode.apply(null, s)
              this.blocks.push({ type: 'MessageBlock', displayTime: e, text: n })
            })()
            break
          case 50:
            (() => {
              const e = r.getUint16(o, !0)
              o += 2, this.blocks.push({ type: 'ArchiveInfo', data: new Uint8Array(i, o, e) }), o += e
            })()
            break
          case 51:
            (() => {
              const e = 3 * r.getUint8(o)
              o += 1, this.blocks.push({ type: 'HardwareType', data: new Uint8Array(i, o, e) }), o += e
            })()
            break
          case 53:
            (() => {
              const e = new Uint8Array(i, o, 10)
              o += 10
              const t = String.fromCharCode.apply(null, e), s = r.getUint32(o, !0)
              this.blocks.push({ type: 'CustomInfo', identifier: t, data: new Uint8Array(i, o, s) }), o += s
            })()
            break
          case 90:
            (() => {o += 9, this.blocks.push({ type: 'Glue' })})()
            break
          default:
            (() => {
              const e = r.getUint32(o, !0)
              o += 4, this.blocks.push({ type: 'unknown', data: new Uint8Array(i, o, e) }), o += e
            })()
        }
      }
      this.nextBlockIndex = 0, this.loopToBlockIndex, this.repeatCount, this.callStack = [], this.pulseGenerator = new a((e => {
        const t = this.getNextMeaningfulBlock(!1)
        return !!t && (t.generatePulses(e), !0)
      }))
    }
    getNextMeaningfulBlock (e) {
      let t = 0 === this.nextBlockIndex
      for (; ;) {
        if (this.nextBlockIndex >= this.blocks.length) {
          if (t || !e) return null
          this.nextBlockIndex = 0, t = !0
        }
        var s = this.blocks[this.nextBlockIndex]
        switch (s.type) {
          case'StandardSpeedData':
          case'TurboSpeedData':
          case'PureTone':
          case'PulseSequence':
          case'PureData':
          case'DirectRecording':
          case'Pause':
            return this.nextBlockIndex++, s
          case'JumpToBlock':
            this.nextBlockIndex += s.offset
            break
          case'LoopStart':
            this.loopToBlockIndex = this.nextBlockIndex + 1, this.repeatCount = s.repeatCount, this.nextBlockIndex++
            break
          case'LoopEnd':
            this.repeatCount--, this.repeatCount > 0 ? this.nextBlockIndex = this.loopToBlockIndex : this.nextBlockIndex++
            break
          case'CallSequence':
            this.callStack.unshift(this.nextBlockIndex + 1)
            for (var n = s.offsets.length - 1; n >= 0; n--) this.callStack.unshift(this.nextBlockIndex + s.offsets[n])
            this.nextBlockIndex = this.callStack.shift()
            break
          case'ReturnFromSequence':
            this.nextBlockIndex = this.callStack.shift()
            break
          default:
            this.nextBlockIndex++
        }
      }
    }
    getNextLoadableBlock () {
      for (; ;) {
        var e = this.getNextMeaningfulBlock(!0)
        if (!e) return null
        if ('StandardSpeedData' == e.type || 'TurboSpeedData' == e.type) return e.data
      }
    }
  }
  let o = null, l = null, c = null, h = null, u = null, d = null, g = !1, p = null, k = !1
  const f = (e, t) => {c.set(t, o.MACHINE_MEMORY + 16384 * e)}, b = () => {
    if (!p) return
    const e = p.getNextLoadableBlock()
    if (!e) return
    const t = u[4], s = t >> 8, n = 1 & t
    let a = u[8]
    const i = u[2], r = e[0]
    let l = !0
    if (s != r) l = !1
    else if (n) {
      let t = 1, s = 0, n = r
      for (; s < i;) {
        if (t >= e.length) {
          l = !1
          break
        }
        const i = e[t++]
        s++, o.poke(a, i), a = a + 1 & 65535, n ^= i
      }
      l &= t < e.length, l && (l = n === e[t])
    } else l = !0
    l ? u[0] |= 1 : u[0] &= 65534, o.setPC(1506)
  }
  onmessage = e => {
    switch (e.data.message) {
      case'loadCore':
        t = e.data.baseUrl, WebAssembly.instantiateStreaming(fetch(new URL('jsspeccy-core.wasm', t), {})).then((e => {o = e.instance.exports, l = o.memory, c = new Uint8Array(l.buffer), h = c.subarray(o.FRAME_BUFFER, 26112), u = new Uint16Array(o.memory.buffer, o.REGISTERS, 12), d = new Uint16Array(o.memory.buffer, o.TAPE_PULSES, o.TAPE_PULSES_LENGTH), postMessage({ message: 'ready' })}))
        break
      case'runFrame':
        if (g) return
        const s = e.data.frameBuffer, n = new Uint8Array(s)
        let a = null, m = null, y = 0
        if ('audioBufferLeft' in e.data ? (a = e.data.audioBufferLeft, m = e.data.audioBufferRight, y = a.byteLength / 4, o.setAudioSamplesPerFrame(y)) : o.setAudioSamplesPerFrame(0), p && k) {
          const e = o.getTapePulseBufferTstateCount(),
            t = o.getTapePulseWriteIndex(), [s, n, a] = p.pulseGenerator.emitPulses(d, t, 8e4 - e)
          o.setTapePulseBufferState(s, e + n), a && (k = !1, postMessage({ message: 'stoppedTape' }))
        }
        let U = o.runFrame()
        for (; U;) {
          switch (U) {
            case 1:
              throw g = !0, 'Unrecognised opcode!'
            case 2:
              b()
              break
            default:
              throw g = !0, 'runFrame returned unexpected result: ' + U
          }
          U = o.resumeFrame()
        }
        if (n.set(h), y) {
          const e = new Float32Array(o.memory.buffer, o.AUDIO_BUFFER_LEFT, y),
            t = new Float32Array(o.memory.buffer, o.AUDIO_BUFFER_RIGHT, y), n = new Float32Array(a),
            i = new Float32Array(m)
          n.set(e), i.set(t), postMessage({
            message: 'frameCompleted',
            frameBuffer: s,
            audioBufferLeft: a,
            audioBufferRight: m
          }, [s, a, m])
        } else postMessage({ message: 'frameCompleted', frameBuffer: s }, [s])
        break
      case'keyDown':
        o.keyDown(e.data.row, e.data.mask)
        break
      case'keyUp':
        o.keyUp(e.data.row, e.data.mask)
        break
      case'setMachineType':
        o.setMachineType(e.data.type)
        break
      case'reset':
        o.reset()
        break
      case'loadMemory':
        f(e.data.page, e.data.data)
        break
      case'loadSnapshot':
        (e => {
          o.setMachineType(e.model)
          for (let t in e.memoryPages) f(t, e.memoryPages[t]);
          ['AF', 'BC', 'DE', 'HL', 'AF_', 'BC_', 'DE_', 'HL_', 'IX', 'IY', 'SP', 'IR'].forEach(((t, s) => {u[s] = e.registers[t]})), o.setPC(e.registers.PC), o.setIFF1(e.registers.iff1), o.setIFF2(e.registers.iff2), o.setIM(e.registers.im), o.setHalted(!!e.halted), o.writePort(254, e.ulaState.borderColour), 48 != e.model && o.writePort(32765, e.ulaState.pagingFlags), o.setTStates(e.tstates)
        })(e.data.snapshot), postMessage({ message: 'fileOpened', id: e.data.id, mediaType: 'snapshot' })
        break
      case'openTAPFile':
        p = new i(e.data.data), k = !1, postMessage({ message: 'fileOpened', id: e.data.id, mediaType: 'tape' })
        break
      case'openTZXFile':
        p = new r(e.data.data), k = !1, postMessage({ message: 'fileOpened', id: e.data.id, mediaType: 'tape' })
        break
      case'playTape':
        p && !k && (k = !0, postMessage({ message: 'playingTape' }))
        break
      case'stopTape':
        p && k && (k = !1, postMessage({ message: 'stoppedTape' }))
        break
      case'setTapeTraps':
        o.setTapeTraps(e.data.value)
        break
      default:
        console.log('message received by worker:', e.data)
    }
    var t
  }
})()