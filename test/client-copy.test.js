import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const loginSource = await readFile(new URL('../website-login.js', import.meta.url), 'utf8')

test('brand is written AIyting everywhere it is visible', () => {
  assert.match(source, /'AIyting生图\/生视频'/)
  assert.doesNotMatch(source, /'aiyting 生图/)
  assert.doesNotMatch(source, /'登录 AIyting，开始创作'/)
})

test('sign-in is website-only: one primary button starts the device flow', () => {
  assert.match(source, /const startLogin = \(\) => \{[\s\S]*?void loginChange\('login_begin'\)/)
  assert.match(source, /onClick: startLogin \}, t\('signIn'\)\)/)
  assert.doesNotMatch(source, /showManualConnection/)
  assert.doesNotMatch(source, /onClick: \(\) => void loginChange\('login_begin'\)/)
})

test('no access-key form or key link is offered anywhere in the panel', () => {
  assert.doesNotMatch(source, /aiyting-key-input/)
  assert.doesNotMatch(source, /aiyting-key-form/)
  assert.doesNotMatch(source, /data-aiyting-key-form/)
  assert.doesNotMatch(source, /home\?view=apiKeys/)
  assert.doesNotMatch(source, /manualConnect/)
})

test('both login/register links open the website home with the one-shot auth entry', () => {
  const entry = "external('https://aiyting.com/?auth=login&client=dsh-plugin'"
  assert.equal(source.split(entry).length - 1, 2)
  assert.doesNotMatch(source, /external\('https:\/\/aiyting\.com\/', t\('login'\)/)
})

test('recharge and pricing stay separate links, and recharge opens the plugin page', () => {
  assert.match(source, /rechargeEntry: '充值'/)
  assert.match(source, /external\('https:\/\/aiyting\.com\/recharge\?client=dsh-plugin', t\('rechargeEntry'\)\)/)
  assert.match(source, /external\('https:\/\/aiyting\.com\/recharge\?client=dsh-plugin', t\('rechargeEntry'\), ''\)/)
  assert.match(source, /external\('https:\/\/aiyting\.com\/pricing', t\('recharge'\), ''\)/)
})

test('no visible copy sends the user to a key entry or a settings page that no longer exists', () => {
  for (const text of [source, loginSource]) {
    assert.doesNotMatch(text, /接入密钥/)
    assert.doesNotMatch(text, /高级设置/)
    assert.doesNotMatch(text, /access key/i)
  }
  assert.match(source, /capabilityHint: '以当前登录账号的权限为准'/)
  assert.match(source, /capabilityHint: 'Based on your signed-in account'/)
})
