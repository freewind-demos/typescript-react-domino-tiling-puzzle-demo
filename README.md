# 骨牌平铺问题

## 简介

一个交互式网页工具，用于判断打散后的骨牌碎块能否通过平移重新铺满原始形状。

## 快速开始

### 环境要求

任意现代浏览器（Chrome、Firefox、Safari、Edge）

### 运行

直接在浏览器中打开 `index.html` 文件即可。

## 功能说明

### 绘制原始形状

- 点击"绘制"按钮后，在左侧网格中点击可添加格子
- 点击"擦除"按钮后，点击格子可移除
- 形状由红色格子组成，表示原始骨牌布局

### 生成碎块

- 点击"生成碎块"按钮，随机将原始形状打散成若干碎块
- 每个碎块用绿色方格表示
- 碎块数量为2-5块随机

### 判断求解

- 点击"开始判断"按钮，使用回溯算法判断能否铺满
- 算法会自动尝试所有可能的平移组合
- 结果会显示成功/失败，以及搜索耗时和回溯次数

### 模式切换

- "点击选择"模式：点击碎块可查看其在原始形状中的位置
- "自动放置"模式：自动运行求解器，高亮显示解决方案

## 完整讲解

### 问题本质

这是一个多胞形填充问题（Polyomino Packing）。核心约束是：

1. **只能平移，不能旋转或翻转**
2. **覆盖全部原始格子**
3. **不能有任何重叠**

### 算法设计

采用**回溯搜索**（Backtracking）求解：

```
1. 将原始形状的格子转换为集合 O
2. 将碎块按大小降序排列（优化：先放大的）
3. 对第 i 个碎块，尝试所有可能的放置位置：
   a. 计算碎块的边界框
   b. 对原始形状中每个格子，计算偏移量
   c. 检查偏移后碎块是否：
      - 完全落在原始形状内
      - 不与已放置碎块重叠
   d. 如果合法，递归放置下一个碎块
   e. 如果失败，回溯尝试其他位置
4. 如果所有碎块都成功放置，返回成功
```

### 关键代码解析

**数据结构**：

```javascript
// 原始形状：格子坐标集合
originalCells = Set<"x,y">

// 碎块：坐标数组 + 放置偏移
fragment = {
  id: number,
  cells: [[x,y], [x,y], ...],  // 相对坐标
  offsetX: number,             // 放置偏移
  offsetY: number
}
```

**放置检查**：

```javascript
function canPlace(fragment, offsetX, offsetY, originalArray, placements) {
  for (const cell of fragment.cells) {
    const key = `${cell[0] + offsetX},${cell[1] + offsetY}`;

    // 检查是否在原始形状内
    if (!originalCells.has(key)) return false;

    // 检查是否被其他碎块占据
    for (const placement of placements) {
      if (placement && placement.usedCells.has(key)) return false;
    }
  }
  return true;
}
```

### 优化策略

1. **降序排列**：先放置大的碎块，减少搜索分支
2. **面积预检**：快速排除面积不相等的情况
3. **边界约束**：利用边界框快速剪枝

### 复杂度

最坏情况下时间复杂度为 O(n!)，其中 n 为碎块数量。但实际应用中：
- 约束条件大大减少搜索空间
- 几十块碎块通常能在毫秒级求解

## 参考资料

- [ Dancing Links (Algorithm X )](https://en.wikipedia.org/wiki/Algorithm_X) - 精确覆盖问题经典算法
- [OR-Tools CP-SAT](https://developers.google.com/optimization/cp/cp_solver) - Google 工业级约束求解器
- [Polyomino](https://en.wikipedia.org/wiki/Polyomino) - 多胞形数学理论
