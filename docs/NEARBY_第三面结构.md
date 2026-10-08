# NEARBY｜第三面：设计概念、技术研究与概念发展

第三面按提供的参考重排，尺寸保持 1684×595，字体为 IBM Plex Sans，配色为深灰、暖橙及米白。使用可编辑文字、图标实例、关系图和图片框。

## 左侧：Design Concept

核心命题：A familiar place, within reach.（熟悉的位置，就在手边。）

面向居家生活的认知症长者，将日常必需品、直接操作和照护协作结合为一个移动收纳系统。

上方采用四格结构：核心命题；使用者遥控 COME／STAY／HELP；照护者 App 的约定位置／回应求助／补充物品；柜体与家庭地图的固定四格／约定停靠点／可见状态。

三项目标：

1. 找到熟悉的必需品：眼镜、手机、水和纸巾保留在约定位置。
2. 决定物品何时靠近：通过 COME 与 STAY 操作，取用前暂停移动。
3. 清楚知道求助结果：区分发送中、已送达与照护者回复。

底部以「使用者＋柜体」为中心，连接照护者 App、家庭地图和直接遥控器。右侧说明系统共享物品、地点与请求信息，以及当前 demo 与后续技术提案的范围。

视觉：保留参考的深色背景、浅色粗体标题、细分区条、上部功能矩阵及底部环形关系图；使用项目 IBM Plex Sans 字体与暖橙配色。图标为矢量实例，文字可编辑。
## 中间：Technical Research（更新）

按参考的「技术原理—基本结构—应用参考」三段式重排。中间板块不使用项目 Demo 截图。

用户确认的原型配置：STM32 上运行本地人脸识别 AI；摄像头模块；四根 A2 电动推杆用于平台升降；底部电动轮用于跟踪人；简单手机界面用于控制。此前“气杆”的表述现更正为电动推杆。A2 仅记录为用户提供的型号名称，不补写未经确认的电压、推力、行程或品牌。

英文正文及中文对应：

### Embedded Vision + Motion Control

- **On-device vision**：Camera frames are processed on the STM32. Face detection and identity matching are separate steps. 摄像头画面在 STM32 上处理；人脸检测与身份匹配属于不同步骤。
- **Four-point electric lift**：A2 motor-driven pushrods raise and lower the platform. Coordinated travel and end limits need verification. 四根 A2 电动推杆用于平台升降；各杆行程协调与终点限位仍需要验证。
- **Following + phone commands**：Target tracking guides the powered wheel base. The phone provides direct commands and status feedback. 目标跟踪用于引导底部电动轮；手机用于直接控制与状态反馈。

### Basic Structure / Functional Architecture

摄像头模块 → STM32（本地人脸识别＋控制逻辑）→ 驱动模块 → 两类输出：

1. 四根 A2 推杆：平台高度。
2. 电动轮：人物跟随。

手机界面连接 STM32 控制逻辑。该图是功能结构，不是已核验的电路接线图；不推断具体通信协议、驱动型号或跟随算法。身份识别并不等于连续定位与跟随控制。

### Technology Applications / Reference Examples

1. **Recognize / On-device face matching**：ST 官方 FP-AI-FACEREC1 案例图。
2. **Lift / Electric linear motion**：Bansbach 电动推杆剖面资料图，属于原理参考，并非 A2 零件照片。
3. **Move / Motor-driven wheel base**：Pololu 3pi+ 2040 电动底盘资料图，属于驱动参考，并非本项目底盘，也不作为该底盘具有人物跟随功能的证据。

所有参考图片均注明外部资料用途。原型本身的识别速度、准确率、推力、跟随距离和精度没有测量数据，因此未填入作品集。
## 右侧：Concept Development

熟悉物品布局、清楚的请求和约定停靠点共同构成拟议交互逻辑；同时保留可见状态与使用者选择。

核心命题：保持熟悉的位置关系，由请求改变物品与人的距离。

请求：COME／STAY／HELP。
反馈：Moving／Paused／Arrived。

拟议规则：明确请求后移动；收到 STAY 或存在未解决的导航不确定性时停止；再次移动前需要新的、可理解的选择。界面仅提供下一步需要的物品、地点与状态信息。

熟悉感、选择权、可及性、清晰度与照护协作均作为待验证方向，应与固定收纳及手推柜进行比较。

## 技术资料（更新）

- [1] [ST：FP-AI-FACEREC1](https://blog.st.com/fp-ai-facerec1/)。官方 STM32H7 本地人脸识别案例；用于说明技术可行方向，不据此推断项目采用 H7 或该软件包。
- [2] [Bansbach：Electric Actuators](https://www.bansbach.com/en/products/in-line-aktuatoren/)。电机、齿轮及丝杆的电动推杆原理与多杆控制参考。
- [3] [Pololu：3pi+ 2040](https://www.pololu.com/product/5001)。电动轮底盘及驱动参考。
- [4] [LINAK：Desk Control App](https://www.linak.co.uk/products/controls/desk-control-app/)。手机控制桌面升降的界面功能参考，未声称本项目使用 LINAK 或相同通信协议。

图片原始来源：

- 人脸识别：https://blog.st.com/wp-content/uploads/2025/11/screenshot_facereco.jpg
- 电动推杆：https://www.bansbach.com/wp-content/uploads/2022/07/bansbach-easye-i-produkt-uebersicht-1-807x734.png
- 电动底盘：https://a.pololu-files.com/picture/0J12003.600x480.jpg?afe1131c6d71cc10bc34d0244f259d84

[查看第三面](https://www.figma.com/design/ApoghdbZoRBlbBcDctaMXf/Untitled?node-id=206-1132)

## Concept Development 图片更新

关系图中的两张项目渲染图已换成网络情境照片，分别对应「熟悉物品」与「熟悉空间」。照片仅作情境说明，不作为实地调研证据。

- [5] George Milton / Pexels：[桌上的眼镜与书本](https://www.pexels.com/photo/book-with-trendy-eyeglasses-placed-on-wooden-table-7034464/)
- [6] Rachel Claire / Pexels：[扶手椅与边几](https://www.pexels.com/photo/soft-armchair-near-side-table-in-room-5490337/)

两张图片均已按小图尺寸调整裁切，并在 Figma 图注及来源行中加入链接。

## Concept Development 参考版式重排

本区按参考建立「左侧情境照片—中央圆形主轴—右侧需求与反馈」结构，沿用 IBM Plex Sans 与暖橙色。顶部与底部为浅色圆形节点，中间两枚橙色节点通过加号表达「熟悉空间 + 日常习惯」；右侧圆角分支连接日常需求、可见反馈与简单控制。底部五项优势等宽排列，并以浅橙光晕突出图标。

英文节点：Local recognition / Familiar space / Daily routine / Personal settings / Everyday needs / Visible feedback / Simple controls。

左侧两张网络照片分别说明居家环境与日常物品，保留来源编号和链接，不使用项目渲染图。优势标题为 Advantages to Validate，避免将设计目标表述为已验证结果。

[查看重排后的 Concept Development](https://www.figma.com/design/ApoghdbZoRBlbBcDctaMXf/Untitled?node-id=228-1106)
