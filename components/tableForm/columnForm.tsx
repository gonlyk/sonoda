'use client'
import { Col, Form, Input, InputNumber, Radio, Row, Select, Switch } from 'antd'
import { DatabaseType, databaseTypeNameMap } from '../../shared/databaseType'
import { ControllerDataNameMap, ControllerDataTypeDefault, ControllerType, typeToController } from '../../shared/controllerType'
import { geneInitExtraData, tableFormData } from '../../store/tableForm'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { useWatch } from 'antd/es/form/Form'
import Controllers from './controllers'
import ExtraDataForm from './extraDataForm'
const { Item } = Form

function ColumnForm({ index, disabled }: { index: number, disabled: boolean }) {
  const [customDefault, setCustomDefault] = useState(!tableFormData.columns[index].defaultValue?.buildIn)
  const dbTypeOption = useMemo(() => Object.entries(databaseTypeNameMap)
    .map(([type, name]) => ({ label: name, value: Number(type) as DatabaseType })), [])

  const currCol = tableFormData.columns[index]
  const dbType = currCol.type
  const controllerType = currCol.controller.type
  const isModify = tableFormData.isModify

  return (
    <div style={{ width: '60%', minWidth: '500px' }}>
      <Item label="字段名" required {...tableFormData.columnErrors.get(index)?.get('name') || {}}>
        <Input disabled={disabled || isModify}
          value={currCol.name}
          onChange={e => runInAction(() => currCol.name = e.target.value)} />
      </Item>
      <Item label="显示名" required {...tableFormData.columnErrors.get(index)?.get('title') || {}}>
        <Input disabled={disabled}
          value={currCol.title}
          onChange={e => runInAction(() => currCol.title = e.target.value)} />
      </Item>
      <Item label="数据库类型">
        <Row gutter={10}>
          <Col span={12}>
            <Item label="类型">
              <Select disabled={disabled || isModify} options={dbTypeOption}
                value={dbType}
                onChange={(type: DatabaseType) => {
                  runInAction(() => {
                    currCol.type = type
                    if (!typeToController[type].includes(currCol.controller?.type)) {
                      currCol.controller.type = ControllerType.NONE
                    }
                  })
                  if (type !== DatabaseType.TIMESTAMP && type !== DatabaseType.VARCHAR) {
                    setCustomDefault(true)
                  }
                }} />
            </Item>
          </Col>
          {
            dbType === DatabaseType.VARCHAR
              ? <Col span={12}>
                <Item label="长度" {...tableFormData.columnErrors.get(index)?.get('typeSize') || {}}>
                  <InputNumber disabled={disabled || isModify} style={{ width: '100%' }} precision={0}
                    min={1}
                    max={255}
                    value={currCol.typeSize}
                    onChange={val => runInAction(() => val && (currCol.typeSize = val))} />
                </Item>
              </Col>
              : null
          }
        </Row>
      </Item>
      <Item label="数组">
        <Switch disabled={disabled}
          value={currCol.increase}
          onChange={increase => runInAction(() => currCol.increase = increase)} />
      </Item>
      <Item label="必填">
        <Switch disabled={disabled}
          value={currCol.required}
          onChange={required => runInAction(() => currCol.required = required)} />
      </Item>
      <Item label="有唯一值">
        <Switch disabled={disabled}
          value={currCol.uniqueValue}
          onChange={uniqueValue => runInAction(() => currCol.uniqueValue = uniqueValue)} />
      </Item>
      <Item label="控件">
        <Select disabled={disabled}
          options={typeToController[dbType]
            ?.map(c => ({ label: ControllerDataNameMap[c], value: c })) || []}
          value={currCol.controller.type}
          onChange={type => runInAction(() => {
            currCol.controller.type = type
            currCol.controller.extraType = ControllerDataTypeDefault[type]
            currCol.controller.data = geneInitExtraData()
            if (type !== ControllerType.NONE) {
              setCustomDefault(true)
            }
          })} />
      </Item>
      <ExtraDataForm type={controllerType} index={index} />
      <Item label="默认值">
        <Radio.Group value={customDefault} disabled={disabled}
          onChange={e => runInAction(() => setCustomDefault(e.target.value))}>
          <Radio value={true}>{currCol.controller.type === ControllerType.NONE ? '计算' : '自定义'}</Radio>
          {
            (dbType === DatabaseType.TIMESTAMP || dbType === DatabaseType.VARCHAR)
              && currCol.controller.type === ControllerType.NONE
              ? <Radio value={false}>内置</Radio>
              : null
          }
        </Radio.Group>
        {
          customDefault
            ? <Item>
              <Controllers type={controllerType}
                value={currCol.defaultValue.value}
                onChange={value => runInAction(() => currCol.defaultValue.value = value)}
                controller={currCol.controller} />
            </Item>
            : <Item>
              <Select disabled={disabled}
                options={['createUser', 'createTime', 'updateUser', 'updateTime']
                  .map(buildIn => ({ label: buildIn, value: buildIn }))}
                value={currCol.defaultValue.buildIn}
                onChange={buildIn => runInAction(() => currCol.defaultValue.buildIn = buildIn)}></Select>
            </Item>
        }
      </Item>
      <Item name={[index, 'comment']} label="注释">
        <Input disabled={disabled} />
      </Item>
    </div>
  )
}

export default observer(ColumnForm)
