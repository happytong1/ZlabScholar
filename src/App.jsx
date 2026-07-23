"use client";

import { useEffect, useMemo, useState } from "react";
import "../app/globals.css";

const CITATION_UPDATED_AT = "2026-07-15";
const CITATION_SOURCE = "Crossref";
const PAPERS_PER_PAGE = 10;
const QUARTILE_STANDARD = "SCI/JCR 2026（取各学科最佳分区）；中科院 2025 终版（2026 年沿用）";

const JOURNAL_QUARTILES = {
  "Scientific Reports": { sci: "SCI Q1", cas: "中科院3区" },
  "Applied Sciences": { sci: "SCI Q2", cas: "中科院4区" },
  "Chinese Physics B": { sci: "SCI Q3", cas: "中科院3区" },
  "Transplantation Proceedings": { sci: "SCI Q4", cas: "中科院4区" },
  "IEEE Geoscience and Remote Sensing Letters": { sci: "SCI Q1", cas: "中科院3区" },
  "International Journal of Imaging Systems and Technology": { sci: "SCI Q2", cas: "中科院4区" },
  "Aerospace": { sci: "SCI Q2", cas: "中科院3区" },
  "IEEE Aerospace and Electronic Systems Magazine": { sci: "SCI Q1", cas: "中科院3区" },
  "Arabian Journal for Science and Engineering": { sci: "SCI Q2", cas: "中科院4区" },
  "Bioinformatics": { sci: "SCI Q1", cas: "中科院3区" },
  "Expert Systems with Applications": { sci: "SCI Q1", cas: "中科院1区" },
  "Genes": { sci: "SCI Q2", cas: "中科院3区" },
  "Engineering Applications of Artificial Intelligence": { sci: "SCI Q1", cas: "中科院1区" },
  "IEEE Transactions on Instrumentation and Measurement": { sci: "SCI Q1", cas: "中科院2区" },
  "Journal of Marine Science and Engineering": { sci: "SCI Q2", cas: "中科院3区" },
  "Entropy": { sci: "SCI Q2", cas: "中科院3区" },
  "BMC Medical Imaging": { sci: "SCI Q1", cas: "中科院3区" },
  "Science China Chemistry": { sci: "SCI Q1", cas: "中科院1区" }
};

const NON_SCI_JOURNAL_VENUES = new Set([
  "无人系统技术",
  "系统工程与电子技术",
  "计算机工程与科学",
  "电子科技大学学报",
  "计算机工程与设计",
  "岩土工程学报",
  "爆炸与冲击",
  "高压物理学报",
  "力学学报"
]);

const NON_JOURNAL_VENUES = new Set([
  "Medical Image Computing and Computer Assisted Intervention – MICCAI 2024",
  "Research Square",
  "IEEE/CVF Conference on Computer Vision and Pattern Recognition",
  "Hands-On Research in Complex Systems School (学术海报)"
]);

function journalQuartiles(venue) {
  if (JOURNAL_QUARTILES[venue]) return JOURNAL_QUARTILES[venue];
  if (NON_JOURNAL_VENUES.has(venue)) return { sci: "非期刊", cas: "不适用" };
  if (NON_SCI_JOURNAL_VENUES.has(venue)) return { sci: "非 SCI", cas: "不适用" };
  return { sci: "待核实", cas: "待核实" };
}

const initialPapers = [
  {
    id: 1,
    title: "Prediction of cardiovascular disease risk based on major contributing features",
    authors: "Mengxiao Peng, Fan Hou, Zhixiang Cheng, Tongtong Shen, Kaixian Liu, Cai Zhao, Wen Zheng",
    venue: "Scientific Reports",
    year: 2023,
    citations: 48,
    open: true,
    doi: "10.1038/s41598-023-31870-8",
    keywords: ["Cardiovascular Disease", "Risk Prediction", "Machine Learning"],
    abstract: "This study develops a machine-learning model for cardiovascular disease risk prediction and identifies the clinical features that contribute most strongly to individual risk estimates."
  },
  {
    id: 2,
    title: "A cardiovascular disease risk score model based on high contribution characteristics",
    authors: "Mengxiao Peng, Fan Hou, Zhixiang Cheng, Tongtong Shen, Kaixian Liu, Cai Zhao, Wen Zheng",
    venue: "Applied Sciences",
    year: 2023,
    citations: 8,
    open: true,
    doi: "10.3390/app13020893",
    keywords: ["Cardiovascular Disease", "Risk Score", "XGBoost"],
    abstract: "The paper proposes an XGBoost-based cardiovascular risk scoring model using high-contribution clinical characteristics and evaluates a compact screening version for practical use."
  },
  {
    id: 3,
    title: "Revealing structural signatures associated with stress overshoot in two-dimensional Lennard-Jones systems based on interpretable deep learning",
    authors: "Tongtong Shen, Xinyao Wang, Zhuohang Li, Xueyu Liu, Wen Zheng",
    venue: "Chinese Physics B",
    year: 2026,
    citations: 0,
    open: false,
    doi: "10.1088/1674-1056/ae843a",
    keywords: ["Amorphous Materials", "Stress Overshoot", "Interpretable AI"],
    abstract: "An interpretable convolutional-temporal model is used to predict stress-overshoot behavior from pre-yield configurations and to characterize model-salient structural signatures in amorphous systems."
  },
  {
    id: 4,
    title: "Preoperative Predictive Modeling of Recurrent Graft Failure: Development and Validation of a 12-Month Prognostic Tool in Kidney Transplant Recipients",
    authors: "Tongtong Shen, Xinyao Wang, Xueyu Liu, Wen Zheng",
    venue: "Transplantation Proceedings",
    year: 2026,
    citations: 0,
    open: false,
    doi: "10.1016/j.transproceed.2026.05.027",
    keywords: ["Kidney Transplantation", "Prognostic Model", "Machine Learning"],
    abstract: "This work develops and validates a preoperative model for estimating the 12-month risk of recurrent graft failure in kidney transplant recipients."
  },
  {
    id: 5,
    title: "CAFE-Net: Context-Aware Feature Enhancement for Reliable Multi-Scale Detection of Martian Craters",
    authors: "Zhuohang Li, Xinyao Wang, Zhaozhao Zhang, Tongtong Shen, Wen Zheng",
    venue: "IEEE Geoscience and Remote Sensing Letters",
    year: 2026,
    citations: 0,
    open: false,
    doi: "10.1109/LGRS.2026.3691336",
    keywords: ["Martian Craters", "Object Detection", "Remote Sensing"],
    abstract: "CAFE-Net combines multi-scale contextual modeling and feature enhancement to improve reliable Martian crater detection under scale variation and crater-like interference."
  },
  {
    id: 6,
    title: "Efficient multiscale spatial attention 3D abdominal multiorgan segmentation model",
    authors: "Chenxi Yan, Huimin Hou, Tongtong Shen, Huafei Xu, Chen Zhai, Wen Zheng",
    venue: "International Journal of Imaging Systems and Technology",
    year: 2024,
    citations: 0,
    open: false,
    doi: "10.1002/ima.23096",
    keywords: ["3D Segmentation", "Medical Imaging", "Spatial Attention"],
    abstract: "The study presents an efficient multiscale spatial-attention architecture for 3D abdominal multi-organ segmentation with reduced memory use and computational cost."
  },
  {
    id: 7,
    title: "有人机/无人机编队协同作战决策系统架构设计",
    authors: "王新尧，孙厚俊，王朝阳，曹云峰",
    venue: "无人系统技术",
    year: 2020,
    citations: null,
    open: false,
    doi: "10.19942/j.issn.2096-5915.2020.04.008",
    keywords: ["决策系统", "有人机/无人机编队", "协同作战"],
    abstract: "针对有人机/无人机编队协同作战决策系统架构设计问题，基于三模认知自动化方法构建包含操作员、有人机机载智能决策系统和无人机机载智能决策系统的架构，并通过动态仿真验证其有效性。"
  },
  {
    id: 8,
    title: "基于DoDAF的有人/无人机协同作战体系结构建模",
    authors: "王新尧，曹云峰，孙厚俊，韦彩色，陶江",
    venue: "系统工程与电子技术",
    year: 2020,
    citations: null,
    open: false,
    doi: "10.3969/j.issn.1001-506X.2020.10.15",
    keywords: ["DoDAF", "有人机/无人机", "体系结构"],
    abstract: "从系统工程角度引入美国国防部体系结构框架，提出体系结构快速开发方法，对有人/无人机协同作战体系的系统功能、任务活动、信息交互和组织关系进行建模，并通过动态仿真验证模型。"
  },
  {
    id: 9,
    title: "面向复杂系统需求分析的DSL构建",
    authors: "廖万斌，曹云峰，王新尧",
    venue: "系统工程与电子技术",
    year: 2022,
    citations: null,
    open: false,
    doi: "10.12305/j.issn.1001-506X.2022.11.19",
    keywords: ["需求分析", "领域特定语言", "基于模型的系统工程"],
    abstract: "针对复杂系统需求分析缺乏针对性模型工具的问题，基于扩展的GOPPRR元元模型构建领域特定语言，为基于模型的系统工程提供形式化、针对性强的需求分析与建模方法。"
  },
  {
    id: 10,
    title: "An Optimization Method for Manned/Unmanned Aerial Vehicle Collaborative Operation System Architecture Based on PGQNSGA-II",
    authors: "Xinyao Wang, Yunfeng Cao",
    venue: "Aerospace",
    year: 2024,
    citations: 3,
    open: true,
    doi: "10.3390/aerospace11121003",
    keywords: ["Manned/Unmanned Aerial Vehicles", "Architecture Optimization", "PGQNSGA-II"],
    abstract: "A preference-guided quantum non-dominated sorting genetic algorithm is introduced to optimize collaborative-operation system architecture for effectiveness, command-and-control performance, and execution performance under mission constraints."
  },
  {
    id: 11,
    title: "Evaluation of Crewed/Uncrewed Aerial Vehicle Collaborative Operation System Effectiveness Based on AMC-HFADC",
    authors: "Xinyao Wang, Yunfeng Cao, Meng Ding, Xichao Wang, Wangwang Yu",
    venue: "IEEE Aerospace and Electronic Systems Magazine",
    year: 2025,
    citations: 2,
    open: false,
    doi: "10.1109/MAES.2025.3584876",
    keywords: ["Effectiveness Evaluation", "AMC-HFADC", "Human Factors"],
    abstract: "An absorbing Markov chain and human-factors ADC model is proposed for dynamic effectiveness evaluation of crewed/uncrewed aerial vehicle collaborative operation systems across wider operational states and mission processes."
  },
  {
    id: 12,
    title: "CT-Mono: Leveraging CNNs and Transformers for Self-Supervised Depth Estimation in Single-View Scenarios",
    authors: "Jiacheng Zhang, Xichao Wang, Xinyao Wang, Chenxuan Zhu, Liang Zhu",
    venue: "Arabian Journal for Science and Engineering",
    year: 2026,
    citations: 0,
    open: false,
    doi: "10.1007/s13369-025-10625-9",
    keywords: ["Monocular Depth Estimation", "Self-Supervision", "CNNs and Transformers"],
    abstract: "CT-Mono combines convolutional neural networks and transformers with multi-scale feature fusion and cross-region attention to improve self-supervised monocular depth estimation and fine-structure reconstruction in complex scenes."
  },
  {
    id: 13,
    title: "Kssdtree: an interactive Python package for phylogenetic analysis based on sketching technique",
    authors: "Hang Yang, Xiaoxin Lu, Jiaxing Chang, Qing Chang, Wen Zheng, Zehua Chen, Huiguang Yi",
    venue: "Bioinformatics",
    year: 2024,
    citations: 0,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.1093/bioinformatics/btae566",
    keywords: ["Phylogenetics", "Genome Sketching", "Python"],
    abstract: "Kssdtree is an interactive Python package for rapid large-scale phylogenetic analysis using genome sketching, with support for visualization, intra-species analysis, and GTDB-based phylogenetic placement."
  },
  {
    id: 14,
    title: "Feature-Prompting GBMSeg: One-Shot Reference Guided Training-Free Prompt Engineering for Glomerular Basement Membrane Segmentation",
    authors: "Xueyu Liu, Guangze Shi, Rui Wang, Yexin Lai, Jianan Zhang, Lele Sun, Quan Yang, Yongfei Wu, Ming Li, Weixia Han, Wen Zheng",
    venue: "Medical Image Computing and Computer Assisted Intervention – MICCAI 2024",
    year: 2024,
    citations: 4,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.1007/978-3-031-72114-4_27",
    keywords: ["Glomerular Basement Membrane", "Prompt Engineering", "One-Shot Segmentation"],
    abstract: "GBMSeg uses feature matching and automatic prompt engineering to guide a foundation segmentation model from a single annotated reference image, enabling training-free glomerular basement membrane segmentation in electron microscopy images."
  },
  {
    id: 15,
    title: "Transformer based multiple superpixel-instance learning for weakly supervised segmenting lesions of interstitial lung disease",
    authors: "Yexin Lai, Xueyu Liu, Linning E., Yujing Cheng, Shuyan Liu, Yongfei Wu, Wen Zheng",
    venue: "Expert Systems with Applications",
    year: 2024,
    citations: 16,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.1016/j.eswa.2024.124270",
    keywords: ["Interstitial Lung Disease", "Weakly Supervised Segmentation", "Transformer"],
    abstract: "A Transformer-based multiple superpixel-instance learning method captures lesion boundaries and long-range dependencies for weakly supervised segmentation of interstitial lung disease in high-resolution CT images."
  },
  {
    id: 16,
    title: "融合多注意力机制的自监督小样本医学图像分割",
    authors: "要媛媛，刘宇航，程雨菁，彭梦晓，郑文",
    venue: "计算机工程与科学",
    year: 2024,
    citations: null,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.3969/j.issn.1007-130X.2024.03.010",
    keywords: ["小样本", "注意力机制", "自监督", "原型网络"],
    abstract: "针对医学图像标注成本高和标注数据不足的问题，研究融合自监督、超像素表征及多注意力机制的小样本医学图像分割方法，并在 CHAOS 腹部器官数据集上验证其有效性。"
  },
  {
    id: 17,
    title: "Integrated Pleiotropic Gene Set Unveils Comorbidity Insights across Digestive Cancers and Other Diseases",
    authors: "Xinnan Wu, Guangwen Luo, Zhaonian Dong, Wen Zheng, Gengjie Jia",
    venue: "Genes",
    year: 2024,
    citations: 0,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.3390/genes15040478",
    keywords: ["Digestive Cancer", "Comorbidity", "Pleiotropic Genes"],
    abstract: "The study integrates disease-associated genetic evidence to construct a pleiotropic gene set and identify molecular links between digestive cancers and comorbid diseases."
  },
  {
    id: 18,
    title: "Physical information-enhanced graph neural network for predicting phase separation",
    authors: "Yaqiang Zhang, Xuwen Wang, Yanan Wang, Wen Zheng",
    venue: "Chinese Physics B",
    year: 2024,
    citations: 5,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.1088/1674-1056/ad4328",
    keywords: ["Phase Separation", "Graph Neural Network", "Physical Information"],
    abstract: "A graph neural network enriched with physical information is developed to predict phase separation and improve the representation of particle interactions in complex material systems."
  },
  {
    id: 19,
    title: "结合全局信息增强的医学领域命名实体识别研究",
    authors: "要媛媛，付潇，杨东瑛，王洁宁，郑文",
    venue: "电子科技大学学报",
    year: 2024,
    citations: null,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.12178/1001-0548.2023064",
    keywords: ["注意力机制", "图卷积网络", "医疗问诊", "命名实体识别"],
    abstract: "面向中文医疗问诊文本中的不规则表达和专业术语，提出融合注意力机制、双向长短时记忆网络、图卷积网络和句法依赖辅助任务的医学命名实体识别模型。"
  },
  {
    id: 20,
    title: "High-precision detection modeling reveals fundamental structural scales of amorphous materials",
    authors: "Jiamei Cui, Yexin Lai, Yanjun Liu, Yonghe Zhang, Wen Zheng",
    venue: "Research Square",
    year: 2024,
    citations: 0,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.21203/rs.3.rs-4677677/v1",
    keywords: ["Amorphous Materials", "High-Precision Detection", "Structural Scale"],
    abstract: "A high-precision multi-instance detection model identifies and quantifies amorphous microstructures, providing a data-driven estimate of their fundamental structural scale."
  },
  {
    id: 21,
    title: "基于TAO主观诊断偏差性的分类应用",
    authors: "周亚琪，付潇，郑文",
    venue: "计算机工程与设计",
    year: 2024,
    citations: null,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.16208/j.issn1000-7024.2024.09.036",
    keywords: ["甲状腺相关眼病", "Efficient-TAO", "医学图像分类"],
    abstract: "针对甲状腺相关眼病诊断中的主观偏差，提出基于复合模型缩放、动态激活函数和随机权值平均机制的 Efficient-TAO 分类模型，并通过眼肌 CT 图像验证。"
  },
  {
    id: 22,
    title: "Multi-scale multi-instance contrastive learning for whole slide image classification",
    authors: "Jianan Zhang, Fang Hao, Xueyu Liu, Shupei Yao, Yongfei Wu, Ming Li, Wen Zheng",
    venue: "Engineering Applications of Artificial Intelligence",
    year: 2024,
    citations: 16,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.1016/j.engappai.2024.109300",
    keywords: ["Whole Slide Image", "Multi-Instance Learning", "Contrastive Learning"],
    abstract: "A multi-scale multi-instance contrastive learning framework combines slide-level and patch-level supervision to learn discriminative representations across magnifications for whole-slide image classification."
  },
  {
    id: 23,
    title: "Deep Reinforcement Learning Driven Weakly Supervised Lesion Segmentation in Lung CT Sequence Images",
    authors: "Yexin Lai, Xueyu Liu, Xinyi Liang, Chenyang Rong, Yongfei Wu, Wen Zheng",
    venue: "IEEE Transactions on Instrumentation and Measurement",
    year: 2025,
    citations: 3,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.1109/TIM.2025.3571146",
    keywords: ["Lung CT", "Deep Reinforcement Learning", "Weakly Supervised Segmentation"],
    abstract: "The CT smoother agent uses deep reinforcement learning and dual U-Net optimization to exploit continuity across CT slices and refine weakly supervised interstitial lung disease lesion segmentation."
  },
  {
    id: 24,
    title: "Ship-Yolo: A Deep Learning Approach for Ship Detection in Remote Sensing Images",
    authors: "Wuan Shi, Wen Zheng, Zhijing Xu",
    venue: "Journal of Marine Science and Engineering",
    year: 2025,
    citations: 12,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.3390/jmse13040737",
    keywords: ["Ship Detection", "Remote Sensing", "YOLO"],
    abstract: "Ship-Yolo combines efficient local attention, a lightweight decoupled head, partial convolution, and content-aware upsampling for accurate lightweight ship detection in complex remote-sensing scenes."
  },
  {
    id: 25,
    title: "Plug-and-Play PPO: An Adaptive Point Prompt Optimizer Making SAM Greater",
    authors: "Xueyu Liu, Rui Wang, Yexin Lai, Guangze Shi, Feixue Shao, Fang Hao, Jianan Zhang, Jia Shen, Yongfei Wu, Wen Zheng",
    venue: "IEEE/CVF Conference on Computer Vision and Pattern Recognition",
    year: 2025,
    citations: 3,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.1109/CVPR52734.2025.00409",
    keywords: ["Segment Anything Model", "Point Prompt Optimization", "Deep Reinforcement Learning"],
    abstract: "PPO formulates point-prompt refinement for SAM as dual-space heterogeneous graph optimization and uses deep reinforcement learning to improve prompts without additional task-specific training."
  },
  {
    id: 26,
    title: "YOLO-GRBI: An Enhanced Lightweight Detector for Non-Cooperative Spatial Target in Complex Orbital Environments",
    authors: "Zimo Zhou, Shuaiqun Wang, Xinyao Wang, Wen Zheng, Yanli Xu",
    venue: "Entropy",
    year: 2025,
    citations: 1,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.3390/e27090902",
    keywords: ["Space Target Detection", "Lightweight Detector", "YOLO"],
    abstract: "YOLO-GRBI improves lightweight non-cooperative space-target detection through a reparameterized backbone, attention and feature-fusion modules, and reduced convolutional redundancy."
  },
  {
    id: 27,
    title: "SAM-APG: Prompt-guided self-training framework based on SAM for nuclei segmentation with limited annotations",
    authors: "Xiaoxu Yao, Yexin Lai, Xueyu Liu, Chenyuan Wang, Mengyao Wang, Yongfei Wu, Wen Zheng",
    venue: "Expert Systems with Applications",
    year: 2026,
    citations: 0,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: false,
    doi: "10.1016/j.eswa.2026.131758",
    keywords: ["Nuclei Segmentation", "SAM", "Self-Training"],
    abstract: "SAM-APG combines a lightweight SAM adapter with prompt-guided pseudo-label generation and iterative self-training to segment overlapping nuclei using limited annotations."
  },
  {
    id: 28,
    title: "YOLO-SEA: An Enhanced Detection Framework for Multi-Scale Maritime Targets in Complex Sea States and Adverse Weather",
    authors: "Hongmei Deng, Shuaiqun Wang, Xinyao Wang, Wen Zheng, Yanli Xu",
    venue: "Entropy",
    year: 2025,
    citations: 9,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.3390/e27070667",
    keywords: ["Maritime Target Detection", "YOLOv8", "Multi-Scale Fusion"],
    abstract: "YOLO-SEA enhances YOLOv8 with spatial-channel attention, bidirectional multi-scale feature fusion, and Soft-NMS for robust maritime target detection in complex sea states and adverse weather."
  },
  {
    id: 29,
    title: "MCAUnet: a deep learning framework for automated quantification of body composition in liver cirrhosis patients",
    authors: "Jiening Wang, Shuqi Xia, Jie Zhang, Xinyi Wang, Cai Zhao, Wen Zheng",
    venue: "BMC Medical Imaging",
    year: 2025,
    citations: 2,
    citationSource: CITATION_SOURCE,
    citationUpdatedAt: CITATION_UPDATED_AT,
    open: true,
    doi: "10.1186/s12880-025-01756-4",
    keywords: ["Body Composition", "Liver Cirrhosis", "Medical Image Segmentation"],
    abstract: "MCAUnet uses channel-attention feature fusion to automate CT-based body-composition quantification and supports survival analysis for patients with liver cirrhosis."
  },
  {
    id: 30,
    title: "岩体中弹性波传播尺度效应的初步分析",
    authors: "徐松林, 郑文, 刘永贵, 席道瑛, 李广场",
    venue: "岩土工程学报",
    year: 2011,
    citations: null,
    open: false,
    doi: "待补充",
    keywords: ["岩石动力学", "弹性波", "尺度效应", "节理岩体", "量纲分析"],
    abstract: "含缺陷岩体及其中传播的弹性波具有尺度效应。研究针对两个现场测点，分别采用动态与准静态有限元方法分析不同计算尺度下的弹性波传播规律及波速与围压的关系，并基于量纲分析提出半理论波速公式。与现场测试及随机节理模型的比较表明，该公式能够较好描述节理岩体中的弹性波尺度效应。"
  },
  {
    id: 31,
    title: "侧限压缩下干燥砂的动态力学性能",
    authors: "郑文, 徐松林, 胡时胜",
    venue: "爆炸与冲击",
    year: 2011,
    citations: null,
    open: false,
    doi: "10.11883/1001-1455(2011)06-0619-05",
    keywords: ["固体力学", "动态力学性能", "SHPB", "干燥砂", "应变率效应", "预压"],
    abstract: "通过添加波形整形器的分离式霍普金森压杆，研究侧限条件下干燥砂在不同应变率和不同预压下的动态压缩力学性能，并利用MTS810材料实验系统测得准静态压缩应力应变曲线。结果表明，应变率对干燥砂压缩过程影响不大，而不同预压对实验结果影响显著。"
  },
  {
    id: 32,
    title: "冲击下花岗岩界面动态摩擦特性实验研究",
    authors: "徐松林, 郑文, 刘永贵, 郑航",
    venue: "高压物理学报",
    year: 2011,
    citations: null,
    open: false,
    doi: "待补充",
    keywords: ["冲击动力学", "压剪联合冲击", "动态摩擦", "界面滑动"],
    abstract: "为研究岩石界面动态摩擦性能，实验对房山花岗岩开展不同冲击速度和倾斜角下的横剖试样斜撞击，考察高正应力与高速相对滑移条件下的界面动态摩擦状态。结果为理解地震过程中板块动态摩擦强度的急剧降低提供了实验依据。"
  },
  {
    id: 33,
    title: "基于Hopkinson压杆的动态压剪复合加载实验研究",
    authors: "郑文, 徐松林, 蔡超, 胡时胜",
    venue: "力学学报",
    year: 2012,
    citations: null,
    open: false,
    doi: "10.6052/0459-1879-2012-1-lxxb2011-103",
    keywords: ["Hopkinson压杆", "压剪复合加载", "动态力学性能"],
    abstract: "研究提出一种基于Hopkinson压杆的动态压剪复合加载装置，通过带倾斜剖面的垫块实现压剪联合加载，并给出实验原理与数据处理方法。有限元分析及不同冲击速度、不同倾斜角下的铜试样实验表明，该装置可用于研究复杂应力状态下材料的动态力学性能。"
  },
  {
    id: 34,
    title: "Onset of shear thinning and thickening in frictionless granular system",
    authors: "Wen Zheng, Yu Shi, Ning Xu",
    venue: "Hands-On Research in Complex Systems School (学术海报)",
    year: 2012,
    citations: null,
    open: false,
    doi: "无 DOI",
    keywords: ["Shear Thickening", "Granular Materials", "Molecular Dynamics", "Academic Poster"],
    abstract: "This academic poster uses non-equilibrium molecular-dynamics simulations to study the rheology of two-dimensional frictionless granular materials. It identifies Newtonian, shear-thinning, and shear-thickening regimes, relates the transition to stress overshoot and structural changes in the pair distribution function, and examines how the strength of shear thickening varies with system size."
  },
  {
    id: 35,
    title: "Signatures of shear thinning-thickening transition in steady shear flows of dense non-Brownian yield stress systems",
    authors: "Wen Zheng, Yu Shi, Ning Xu",
    venue: "Science China Chemistry",
    year: 2015,
    citations: null,
    open: false,
    doi: "10.1007/s11426-015-5335-8",
    keywords: ["Shear Thickening", "Shear Thinning", "Structural Anisotropy", "Kinetic Temperature"],
    abstract: "Non-equilibrium molecular-dynamics simulations are used to connect structure, dynamics, and rheology in dense athermal systems composed of soft disks. At low shear rates the systems shear thin because of a nonzero yield stress and then cross over to shear thickening. Structural anisotropy, particle dynamics, and kinetic-temperature scaling all show characteristic signatures near the crossover."
  }
];

const fullPaperAbstracts = {
  1: `Cardiovascular disease (CVD) is a major global health threat, and accurate risk prediction can support the early identification and treatment of high-risk patients. This study proposes XGBH, a machine-learning model built around the features that contribute most strongly to CVD risk. To improve generalizability, the authors combined a public Kaggle dataset with retrospective records from 14,832 patients with CVD in Shanxi, China. XGBH achieved an area under the receiver operating characteristic curve (AUC) of 0.81, compared with 0.65 for the baseline risk score, and its performance improved when body mass index was included. For practical screening, the study also developed a simplified model using only age, systolic blood pressure, and cholesterol status; it retained an AUC of 0.79. The resulting compact risk-score model may enable cost-effective early intervention, although prospective validation in additional populations is still required.`,
  2: `Early and reliable cardiovascular disease (CVD) risk assessment is important for diagnosis, treatment, and the prevention of adverse outcomes. This study collected clinical indicators and outcomes from 14,832 patients with CVD in Shanxi, China, and developed XGBH, a risk-prediction and scoring model based on the most influential characteristics. The model substantially outperformed the baseline risk score, increasing the area under the receiver operating characteristic curve from 0.65 to 0.80; adding conventional biometric variables further improved prediction. The authors also designed a simpler screening model that quantifies risk from only three patient-reported or routinely measured characteristics and achieves an AUC of 0.79, with only a modest reduction in accuracy. The models offer a potentially economical way to identify high-risk patients for early intervention, but their clinical effectiveness should be confirmed prospectively and in other populations.`,
  3: `Stress overshoot is a characteristic transient response of amorphous solids, yet the structural signatures that determine its magnitude remain difficult to identify from disordered configurations. This study uses interpretable deep learning to connect the pre-yield structures of two-dimensional Lennard-Jones systems with their subsequent stress response. A convolutional-temporal prediction framework learns configuration-dependent features and estimates stress-overshoot behavior, while interpretation methods identify the particles and local environments that contribute most strongly to the prediction. By comparing the learned importance patterns with conventional structural descriptors, the work characterizes spatially heterogeneous, model-salient regions associated with plastic rearrangement and transient yielding. The results provide a data-driven route for recognizing structural precursors of stress overshoot and for improving the physical interpretation of machine-learning models applied to amorphous materials.`,
  4: `Kidney transplantation is an effective treatment for end-stage renal disease, but recipients remain at risk of graft dysfunction and loss. This retrospective study collected clinical data from 368 recipients who underwent allogeneic kidney transplantation between April 2016 and September 2022 and developed a machine-learning tool for predicting 12-month graft survival. A new feature-selection procedure removed variables weakly related to outcome, after which eight algorithms were compared with attention to both predictive ability and efficiency. LightGBM performed best, achieving areas under the receiver operating characteristic curve of 0.80 in internal validation and 0.71 in external validation. Analysis of important postoperative indicators also led the authors to propose an estimated glomerular filtration rate threshold of 45 mL/min/1.73 m² as a more precise criterion for renal dysfunction in transplant recipients. The model and revised threshold may support earlier risk stratification and clinical decision-making.`,
  5: `Reliable detection of Martian impact craters is important for landing-site selection and future surface exploration, but large scale variation and crater-like landforms such as domes make the task difficult. CAFE-Net addresses these problems with three complementary components: a multi-scale context-aware module that captures local texture and ejecta cues, a feature-enhancement unit that reduces the loss of small-crater information, and a channel self-learning fusion strategy that strengthens feature representation through channel-wise interaction. Experiments show gains of 3.94 percentage points in precision and 3.13 points in recall over comparison methods, with an F1 score of 86.41% while retaining efficient inference. The current approach remains limited for nighttime imagery and severely weathered craters; future multi-source data fusion could improve robustness and extend its use in vision-based Mars landing-site assessment.`,
  6: `Accurate 3D medical-image segmentation is essential for clinical applications, but many high-performing self-attention models require substantial computation and memory. This study develops an efficient multiscale spatial-attention network for abdominal multi-organ segmentation. In its encoder and decoder, combinations of one- and two-dimensional kernels approximate three-dimensional convolution and reduce both parameter count and computational cost. A lightweight spatial-attention module captures cross-dimensional relationships, while a mixed-pooling module combines multiscale features with long-range contextual information. On the FLARE dataset, the model achieved a Dice similarity coefficient of 89.86% and a normalized surface Dice of 78.2%, using approximately 1183 MB of GPU memory, 9 million parameters, and 193 GFLOPs. These results show that strong multi-organ segmentation can be maintained within a substantially lighter computational budget.`,
  7: `针对有人机/无人机编队协同作战决策系统架构设计问题，开展了同时考虑有人机指挥操作员状态变化以及异构无人机对有人机决策依赖程度不同对决策系统带来影响的架构设计研究。首先，分析了有人机/无人机编队系统体系结构及其对决策系统需求。其次，基于三模认知自动化方法设计了有人机/无人机编队协同作战决策系统架构，该架构包含三个决策主体：操作员、有人机机载智能决策系统和无人机机载智能决策系统，三个决策主体的交互机制可以为无人机提供任务管理冗余功能，进而提高系统鲁棒性。最后，通过动态仿真对系统架构有效性进行验证。实验表明，该决策系统架构逻辑合理，可适应不同态势下无人机对决策的需求。`,
  8: `有人/无人机协同作战是未来战场中重要的空中作战模式。由于该协同作战体系系统复杂、涉及作战节点多，需从系统工程的角度对整体作战体系进行顶层设计，并采用统一的结构框架对体系结构建模。研究首先引入美国国防部体系结构框架（DoDAF），提出一种体系结构快速开发方法并给出开发步骤；随后利用视图模型，对系统功能、作战任务活动、各作战节点的信息交互及组织关系等建立模型；最后通过动态仿真验证模型。结果表明，所提作战体系的执行状态与预期作战流程一致，体系结构设计合理，系统内各作战节点定义及信息体系结构描述具备一致性和协调性。`,
  9: `航空航天系统复杂度快速增长，尤其给基于模型的系统工程中的复杂系统需求分析带来挑战，而现有需求分析过程缺少有针对性的模型支持工具。研究依据领域建模思想，引入领域特定语言（DSL），提出利用 DSL 开展需求分析的方法，并面向基于模型的系统工程需求构建相应语言。首先从方法论角度分析工程应用中的需求捕获与分解；随后通过扩展 GOPPRR 元元模型，按实际需要定义 DSL 的具体语法和语义；最后以具体系统为例，并与系统建模语言分析方法进行比较。结果表明，所构建 DSL 与复杂系统需求分析和建模的实际需要相契合，在各环节具有针对性强、形式化程度高等优点，有助于保证需求分析及建模工作的正确性。`,
  10: `The architecture of a manned/unmanned aerial vehicle collaborative operation system is crucial to combat effectiveness and resource utilization, but its interdependent components create a constrained multi-objective optimization problem. This study formally represents the architecture and seeks to maximize overall effectiveness, command-and-control performance, and system execution performance under mission and payload constraints. It then develops a preference-guided quantum non-dominated sorting genetic algorithm, PGQNSGA-II. An adaptive quantum-gate mechanism uses preference information to update chromosomes so that qubit probability amplitudes move more effectively toward high-quality solutions. Simulation results show that PGQNSGA-II improves global search capability and optimization efficiency compared with traditional quantum genetic algorithms, demonstrating its suitability for the design and optimization of collaborative-operation system architectures.`,
  11: `This study proposes an absorbing Markov chain–human-factors availability, dependability, and capability model (AMC-HFADC) for dynamically evaluating crewed/uncrewed aerial vehicle collaborative-operation systems. The framework extends conventional ADC evaluation by incorporating operator–vehicle interaction, task difficulty, cognition, and psychological state, while the absorbing Markov chain represents a wider range of operational states and the influence of mission sequence and duration. In the case study, including human factors reduced calculated dependability values by 16%–21% relative to conventional ADC results, showing their material effect on system performance. The analysis also indicates diminishing benefits from crewed/uncrewed cooperation when operator task difficulty becomes excessive. Compared with static HFADC, AMC-HFADC more flexibly and precisely models availability, dependability, capability, and nonfailure steady states across mission scenarios, providing a basis for future effectiveness prediction and decision optimization.`,
  12: `Although self-supervised monocular depth estimation has advanced considerably, real-time visual methods still struggle to reconstruct fine structures in complex scenes. CT-Mono combines convolutional neural networks and Transformers to strengthen both local and global representation. A depthwise separable dilated-convolution block enlarges the receptive field and fuses multiscale pixel features, improving details in important regions. Enhanced local–global feature fusion uses convolution for fine-grained local information and self-attention for long-range dependencies. A lightweight ResNet18-based pose encoder estimates six-degree-of-freedom transformations between adjacent frames and supports reprojection-loss training. On KITTI, CT-Mono achieved an absolute relative error of 0.102 and an RMSE of 4.430, significantly outperforming mainstream comparison methods and demonstrating more accurate fine-structure reconstruction.`,
  13: `Sketching technologies offer a promising route to real-time, large-scale phylogenetic analysis, but existing tools can be restricted by platform support, limited visualization, and biased distance estimates. Kssdtree is an interactive Python package designed to address these limitations. Comprehensive benchmarks show that it provides strong accuracy and time efficiency relative to other sketching-based tools. In addition to rapid phylogeny construction and interactive visualization, Kssdtree supports intra-species phylogenomics and GTDB-based phylogenetic placement, broadening the range and depth of analyses that can be performed. The package is freely available through PyPI, its source code is hosted on GitHub, and documentation and tutorials are provided online, making it an accessible and versatile tool for real-time phylogenetic investigation at scale.`,
  14: `Segmenting the glomerular basement membrane in electron-microscopy images is important for renal pathology but is difficult because annotation is laborious and morphology varies substantially. Feature-Prompting GBMSeg introduces a one-shot, reference-guided framework that requires only one annotated image and no task-specific model training. It identifies reliable correspondences between the reference and target image in feature space, transfers positive and negative prompts, and uses automatic prompt engineering to guide a foundation segmentation model. By combining semantic feature matching with prompt refinement, the method adapts to changes in tissue appearance and produces detailed basement-membrane masks without conventional supervised retraining. Experiments demonstrate competitive segmentation under extremely limited annotation, showing that foundation models can be adapted to specialized microscopy tasks through reference-based feature prompting.`,
  15: `Weakly supervised segmentation of interstitial lung disease lesions in high-resolution CT is challenging because image-level labels do not directly describe lesion location and ordinary multiple-instance learning can overlook boundaries and long-range context. This study proposes a Transformer-based multiple superpixel-instance learning framework. It partitions CT images into superpixels so that instances better respect anatomical and lesion boundaries, learns instance representations, and uses Transformer attention to model relationships among spatially separated regions. Slide- or image-level supervision is then used to infer lesion probabilities and construct segmentation maps. Experiments show that combining superpixel instances with global dependency modeling improves lesion localization and boundary quality compared with conventional weakly supervised approaches, offering a more practical way to obtain detailed ILD lesion masks when dense pixel annotations are unavailable.`,
  16: `主流全监督深度学习分割模型在丰富标注数据上可以取得良好效果，但医学图像分割存在标注成本高、分割目标种类多且标注数据不足等问题。研究提出一种融合自监督学习、超像素表征和多注意力机制的模型，在小样本标注条件下完成医学图像分割。位置注意和通道注意模块用于融合单幅图像内部的多尺度特征，外部注意力模块进一步突出不同样本之间的联系。在 CHAOS 健康腹部器官数据集上，模型在 1-shot 极端条件下的 DSC 达到 0.76，较基线方法提高约 3%。通过调整 N-way-K-shot 任务设置，研究还发现 7-shot 条件下 DSC 显著提升，与全监督深度学习分割效果之间的差距处于可接受范围。`,
  17: `Comorbidity between digestive cancers and other diseases can reflect shared genetic mechanisms, but the relevant pleiotropic genes are dispersed across heterogeneous studies and databases. This work integrates disease-associated genetic evidence to construct a pleiotropic gene set and systematically examines its relationships with digestive cancers and their comorbid conditions. Enrichment and network analyses identify biological processes, pathways, and hub genes shared across disease categories, revealing molecular connections that would be difficult to observe from a single cancer or dataset. The resulting integrated gene set provides a resource for exploring common pathogenesis, prioritizing biomarkers, and generating hypotheses about cross-disease therapeutic targets. More broadly, the study demonstrates how the aggregation of pleiotropic genetic evidence can deepen understanding of why digestive malignancies coexist with apparently distinct disorders.`,
  18: `Phase separation is a central collective phenomenon in soft and condensed matter, but predicting it directly from particle configurations is difficult because learned models must capture both local interactions and global physical organization. This study develops a physics-information-enhanced graph neural network in which particles are represented as graph nodes and their interactions as edges. Physically motivated descriptors and constraints are incorporated into message passing so that the network learns representations consistent with the underlying interaction system rather than relying only on raw coordinates. The model predicts phase-separation behavior across simulated configurations and is evaluated against graph-learning baselines and conventional structural descriptions. Results show that explicitly including physical information improves prediction and robustness, while analysis of learned representations provides insight into the particle-scale structures associated with emerging separated phases.`,
  19: `中文医疗问诊文本中存在大量口语化、不规则表达和专业术语，药物名称等实体因而难以被准确识别。为充分利用中文句子中的词间关系，研究提出一种增强全局信息的医学命名实体识别模型。模型利用注意力机制增强词嵌入表征，并以双向长短时记忆网络获取上下文信息；同时，一方面根据句法关系构建图卷积网络层以丰富词语间的额外依赖，另一方面设置辅助任务预测词间句法依赖类别。在中文医疗问诊数据集上，模型 F1 值达到 94.54%，并在药物、症状等实体类别上取得明显提升。在微博公开数据集上的实验也表明，该模型具有面向通用领域的应用价值。`,
  20: `Characterizing amorphous materials remains difficult because their lack of long-range order makes structural metrics hard to define. This work presents a high-precision detection model for two-dimensional amorphous systems that uses bags and instances to move from image-level classification to structure-level segmentation without additional dynamical information. The authors introduce an order parameter describing structural evolution during amorphous phase transitions and demonstrate that the model accurately detects amorphous microstructures. By examining the optimal detection dimensions in finite-size systems, the method identifies a fundamental structural scale without requiring separate structural or dynamical calculations. The framework therefore provides both a practical detection strategy and a physically interpretable route to understanding disordered structures and transitions in amorphous materials.`,
  21: `甲状腺相关眼病是一种早期病理特征不明显的常见慢性致盲性眼眶疾病。针对诊断过程中医生主观判断偏差可能造成误诊的问题，研究提出基于复合模型缩放方法的 Efficient-TAO。该方法通过优化训练过程，并改进动态激活函数和随机权值平均机制来提高模型性能，同时利用图像预处理算法实现眼肌 CT 图像数据的直接训练。实验结果表明，模型分类准确率达到 98.34%，在其他评价指标上也表现良好。进一步的可视化结果验证了 Efficient-TAO 在疾病分类中的关注区域与判断依据，增强了算法用于甲状腺相关眼病辅助诊断时的可信度。`,
  22: `Whole-slide image classification is difficult because gigapixel pathology slides contain heterogeneous tissue patterns at several magnifications and only slide-level labels are usually available. This study proposes a multi-scale, multi-instance contrastive-learning framework that jointly learns discriminative patch representations and slide-level predictions. Instances sampled at different scales provide complementary cellular, tissue, and contextual information; contrastive objectives encourage related representations to agree while separating those from different diagnostic classes. Multi-instance aggregation then selects and combines informative regions for final classification. Evaluation on pathology datasets shows that the coordinated use of multiple magnifications and contrastive supervision improves classification over single-scale and conventional multiple-instance baselines. The learned attention and representation patterns also offer more informative localization of diagnostically relevant regions.`,
  23: `Weakly supervised lesion segmentation in lung CT commonly treats slices independently, even though lesions change continuously through a CT sequence. This study formulates cross-slice refinement as a sequential decision problem and introduces a CT smoother agent driven by deep reinforcement learning. Initial lesion maps are produced by weakly supervised networks, while the agent observes neighboring slices and learns actions that refine uncertain or inconsistent regions. A dual U-Net optimization strategy coordinates feature learning and mask correction so that anatomical continuity can be exploited without requiring dense annotations for every slice. Experiments on interstitial lung disease CT sequences show improved localization, smoother inter-slice predictions, and more accurate lesion boundaries compared with independent weakly supervised segmentation, demonstrating the value of reinforcement learning for sequence-aware medical-image analysis.`,
  24: `Ship detection in remote-sensing imagery is complicated by large scale variation, dense small targets, complex backgrounds, and the need for efficient deployment. Ship-Yolo introduces a lightweight detector that combines efficient local attention for salient spatial information, a decoupled detection head for task-specific classification and localization, partial convolution to reduce redundant computation, and content-aware upsampling to preserve fine target details. These components improve multiscale feature extraction while keeping the model compact. Experiments on representative ship-detection datasets show higher accuracy and stronger small-target performance than baseline lightweight detectors, with favorable computational cost. The method is therefore suited to practical maritime monitoring scenarios that require a balance among detection precision, robustness, model size, and inference speed.`,
  25: `The Segment Anything Model is strongly influenced by the quality and placement of point prompts, yet manually choosing optimal prompts is costly and unstable. Plug-and-Play PPO formulates point-prompt refinement as an adaptive optimization problem. It represents candidate prompts and mask information in a dual-space heterogeneous graph and employs deep reinforcement learning to select actions that progressively improve segmentation. The optimizer works with SAM in a plug-and-play manner and does not require additional task-specific training of the foundation model. Across multiple datasets and segmentation settings, PPO improves masks produced from imperfect initial points and generalizes to different target categories. The results demonstrate that learning to optimize the interaction with a frozen segmentation model can provide more reliable prompts and stronger segmentation with limited extra supervision.`,
  26: `Detecting non-cooperative space targets in complex orbital environments requires sensitivity to small, low-contrast objects while maintaining a lightweight model suitable for onboard use. YOLO-GRBI modifies a YOLO detector with a reparameterized backbone that strengthens feature extraction during training but can be simplified for inference. Attention and enhanced multi-scale feature-fusion modules emphasize informative target cues and improve communication between shallow spatial detail and deep semantic features, while redesigned convolution blocks reduce redundancy. Experiments on space-target imagery show improved precision, recall, and mean average precision relative to the baseline and other lightweight detectors, with a favorable parameter and computation budget. The framework offers a practical balance between robustness in cluttered orbital scenes and efficient deployment.`,
  27: `Accurate nuclei segmentation is essential for computational pathology, but densely clustered and overlapping nuclei remain challenging and manual annotation is expensive. SAM-APG is a prompt-guided self-training framework that fine-tunes the Segment Anything Model with limited labels and uses reliable pseudo-labels for iterative improvement. A lightweight, single-head-attention-guided adapter bridges the domain gap between natural and pathological images. An automatic prompt and pseudo-label module applies confidence maps, morphological operations, and distance transforms to locate nuclei centers, closing the loop between prompt generation and pseudo-label refinement. On MoNuSeg, TNBC, and CPM-17, the method achieves aggregated Jaccard indices of 66.95%, 67.69%, and 75.01%, respectively. The experiments show effective separation of overlapping and clustered nuclei under limited annotation.`,
  28: `Maritime-target detection in complex sea states and adverse weather is challenged by scale variation, occlusion, clutter, low visibility, and dense target distributions. YOLO-SEA enhances YOLOv8 with a spatial-channel attention mechanism that suppresses background interference and emphasizes informative target regions. A bidirectional multi-scale fusion structure improves the transfer of fine spatial detail and high-level semantics, particularly for small targets, while Soft-NMS reduces missed detections when bounding boxes overlap. Experiments across challenging maritime scenes demonstrate improvements in precision, recall, and mean average precision over the baseline and comparison detectors, with robust behavior under waves, fog, rain, and other difficult conditions. The framework provides a practical detector for intelligent maritime surveillance and situational awareness.`,
  29: `Quantitative CT assessment of skeletal muscle and adipose tissue can provide clinically useful markers in liver cirrhosis, but manual body-composition measurement is slow and observer-dependent. MCAUnet is a deep-learning segmentation framework that combines a U-Net-like encoder–decoder with multi-scale channel-attention feature fusion to preserve anatomical boundaries and emphasize tissue-specific information. The model automatically segments relevant body-composition compartments from abdominal CT and derives quantitative indices for downstream analysis. Comparisons with established segmentation networks show accurate, stable tissue delineation and reduced manual workload. The extracted body-composition measurements are further associated with clinical characteristics and survival outcomes, demonstrating that automated CT quantification can support reproducible assessment, prognostic stratification, and longitudinal management of patients with liver cirrhosis.`
};

const localPdfAssets = {
  3: "/papers/shentongtong/申童童_2026_《Chinese Physics B》_Revealing structural signatures associated with stress overshoot in two.pdf",
  4: "/papers/shentongtong/申童童_2026_《Trans Proceedings》_Preoperative Predictive Modeling of Recurrent Graft Failure.pdf",
  5: "/papers/lizhuohang/李卓杭_2026_《IEEE GEOSCIENCE AND REMOTE SENSING LETTERS,》_CAFE-Net_Context-Aware_Feature_Enhancement_for_Reliable_Multiscale_Detection_of_Martian_Craters.pdf",
  7: "/papers/wangxinyao/王新尧_2020_无人系统技术_有人机无人机编队协同作战决策系统架构设计.pdf",
  8: "/papers/wangxinyao/王新尧_2020_系统工程与电子技术_基于DoDAF的有人无人机协同作战体系结构建模.pdf",
  9: "/papers/wangxinyao/王新尧_2022_系统工程与电子技术_面向复杂系统需求分析的DSL构建.pdf",
  10: "/papers/wangxinyao/王新尧_2024_Aerospace_An Optimization Method for Manned-Unmanned Aerial Vehicle Collaborative Operation System Architecture Based on PGQNSGA-II.pdf",
  11: "/papers/wangxinyao/王新尧_2025_IEEE Aerospace and Electronic Systems Magazine_Evaluation of Crewed-Uncrewed Aerial Vehicle Collaborative Operation System Effectiveness Based on AMC-HFADC.pdf",
  12: "/papers/wangxinyao/王新尧_2026_Arabian Journal for Science and Engineering_CT-Mono Leveraging CNNs and Transformers for Self-Supervised Depth Estimation in Single-View Scenarios.pdf",
  13: "/papers/zhengwen/2024.10.1-Kssdtree an interactive Python package for phylogenetic analysis based on sketching technique.pdf",
  14: "/papers/zhengwen/2024.10.3-Feature-prompting gbmseg One-shot reference guided training-free prompt engineering for glomerular basement membrane segmentation.pdf",
  15: "/papers/zhengwen/2024.11-Transformer based multiple superpixel-instance learning for weakly supervised segmenting lesions of interstitial lung disease.pdf",
  16: "/papers/zhengwen/2024.3-融合多注意力机制的自监督小样本医学图像分割.pdf",
  17: "/papers/zhengwen/2024.4.10-Integrated Pleiotropic Gene Set Unveils Comorbidity Insights across Digestive Cancers and Other Diseases.pdf",
  18: "/papers/zhengwen/2024.4.25-Physical information-enhanced graph neural network for predicting phase separation.pdf",
  19: "/papers/zhengwen/2024.5-结合全局信息增强的医学领域命名实体识别研究.pdf",
  20: "/papers/zhengwen/2024.7.30-high_precision_detection_modeling_reveals_fundamental_structural_scales_of_amorphous_materials.pdf",
  21: "/papers/zhengwen/2024.9-基于TAO主观诊断偏差性的分类应用.pdf",
  22: "/papers/zhengwen/2024.9.12-Multi-scale multi-instance contrastive learning for whole slide image classification.pdf",
  23: "/papers/zhengwen/2025.5.19-Deep_Reinforcement_Learning_Driven_Weakly_Supervised_Lesion_Segmentation_in_Lung_CT_Sequence_Images.pdf",
  24: "/papers/zhengwen/2025.5.19-Ship-Yolo A Deep Learning Approach for Ship Detection in Remote Sensing Images.pdf",
  25: "/papers/zhengwen/2025.6.10-Plug-and-Play_PPO_An_Adaptive_Point_Prompt_Optimizer_Making_SAM_Greater_CVPR_2025_paper.pdf",
  26: "/papers/zhengwen/2025.8.25-YOLO-GRBI An Enhanced Lightweight Detector for Non-Cooperative Spatial Target in Complex Orbital Environments.pdf",
  27: "/papers/zhengwen/2026.2.15-SAM-APG Prompt-guided Self-training Framework Based on SAM for Nuclei Segmentation with Limited Annotations.pdf",
  28: "/papers/zhengwen/2026.6.22-YOLO-SEA AnEnhanced Detection Framework for Multi-Scale Maritime Targets in Complex Sea States and Adverse Weather.pdf",
  29: "/papers/zhengwen/2026.7.1-MCAUnet a deep learning framework for automated quantification of body composition in liver cirrhosis patients.pdf",
  30: "/papers/zhengwen/郑文_2011_《岩土工程学报》_岩体中弹性波传播尺度效应的初步分析.pdf",
  31: "/papers/zhengwen/郑文_2011_《爆炸与冲击》_侧限压缩下干燥砂的动态力学性能.pdf",
  32: "/papers/zhengwen/郑文_2011_《高压物理学报》_冲击下花岗岩界面动态摩擦特性实验研究.pdf",
  33: "/papers/zhengwen/郑文_2012_《力学学报》_基于Hopkinson压杆的动态压剪复合加载实验研究.pdf",
  34: "/papers/zhengwen/郑文_2012_海报_Onset of shear thinning and thickening in frictionless granular system.pdf",
  35: "/papers/zhengwen/郑文_2015_《Science China Chemistry》_Signatures of shear thinning-thickening transition in steady shear flows of dense non-Brownian yield stress systems.pdf"
};

const fallbackProfiles = {
  tongtong: {
    slug: "tongtong-shen",
    name: "Tongtong Shen",
    chineseName: "申童童",
    affiliation: "College of Artificial Intelligence, Taiyuan University of Technology",
    affiliationUrl: "https://www.tyut.edu.cn/",
    role: "Ph.D. Student in Data Science",
    roleCn: "数据科学方向博士研究生",
    email: "2024319017@link.tyut.edu.cn",
    emailNote: "学校邮箱已验证",
    orcid: "https://orcid.org/0009-0004-5900-4556",
    avatar: "/profile-photos/shentongtong.jpg",
    verified: true,
    research: ["Complex Systems", "Amorphous Materials", "AI for Science"]
  },
  xinyao: {
    slug: "xinyao-wang",
    name: "Xinyao Wang",
    chineseName: "王新尧",
    affiliation: "Key Laboratory for Satellite Digitalization Technology, Innovation Academy for Microsatellites of Chinese Academy of Sciences",
    affiliationUrl: "https://www.microsate.ac.cn/",
    role: "Faculty Member",
    roleCn: "教师",
    email: "wangxinyao@microsate.ac.cn",
    emailNote: "联系邮箱",
    orcid: "https://orcid.org/0009-0001-3326-7030",
    avatar: "/profile-photos/wangxinyao.jpg",
    verified: false,
    research: ["Systems Engineering", "Manned/Unmanned Collaboration", "Computer Vision"]
  },
  zhengwen: {
    slug: "wen-zheng",
    name: "Wen Zheng",
    chineseName: "郑文",
    affiliation: "Key Laboratory for Satellite Digitalization Technology, Innovation Academy for Microsatellites of Chinese Academy of Sciences",
    affiliationUrl: "https://www.microsate.ac.cn/",
    role: "Researcher, Deputy Director",
    roleCn: "研究员、副主任",
    email: "zhengwen@microsate.ac.cn",
    emailNote: "联系邮箱",
    homepage: "https://microsate.cas.cn/sourcedb/zw/gbzjrc/jcqn/202404/t20240403_7075517.html",
    orcid: "https://orcid.org/0000-0002-6570-6245",
    avatar: "/profile-photos/zhengwen.png",
    verified: false,
    research: ["Machine Learning", "AI for Science", "Computer Vision"]
  },
  zhuohang: {
    slug: "zhuohang-li",
    name: "Zhuohang Li",
    chineseName: "李卓杭",
    affiliation: "单位信息待补充",
    affiliationUrl: "",
    role: "Ph.D. Student",
    roleCn: "博士研究生",
    email: "邮箱待补充",
    emailNote: "公开信息待完善",
    orcid: "https://orcid.org/0009-0007-9834-1370",
    verified: false,
    research: ["Computer Vision", "Remote Sensing", "AI for Science"]
  },
  yuanyi: {
    slug: "yi-yuan",
    name: "Yi Yuan",
    chineseName: "袁易",
    affiliation: "单位信息待补充",
    affiliationUrl: "",
    role: "Ph.D. Student",
    roleCn: "博士研究生",
    email: "邮箱待补充",
    emailNote: "公开信息待完善",
    verified: false,
    research: ["研究领域待补充"]
  }
};

const Icon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const SearchIcon = () => <Icon><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon>;
const MoonIcon = () => <Icon><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></Icon>;
const SunIcon = () => <Icon><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></Icon>;
const CheckIcon = () => <Icon size={14}><path d="m4 7 2 2 4-5"/></Icon>;
const CloseIcon = () => <Icon size={20}><path d="M18 6 6 18M6 6l12 12"/></Icon>;
function ResearchLinks({ topics, onSelect, onEdit }) {
  return (
    <div className="research-links">
      {topics.map(topic => <button className="research-topic" key={topic} onClick={() => onSelect(topic)}>{topic}</button>)}
      {onEdit && <button className="research-edit" onClick={onEdit} aria-label="修改研究方向">修改方向</button>}
    </div>
  );
}

function optimizeAvatarFile(file) {
  if (!file || !file.size) return Promise.resolve("");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return Promise.reject(new Error("请选择 JPG、PNG 或 WebP 图片"));
  if (file.size > 10 * 1024 * 1024) return Promise.reject(new Error("原始图片不能超过 10 MB"));
  return new Promise((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(file);
    const sourceImage = new Image();
    sourceImage.onload = () => {
      const cropSize = Math.min(sourceImage.naturalWidth, sourceImage.naturalHeight);
      const outputSize = Math.min(640, cropSize);
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(sourceImage, (sourceImage.naturalWidth - cropSize) / 2, (sourceImage.naturalHeight - cropSize) / 2, cropSize, cropSize, 0, 0, outputSize, outputSize);
      URL.revokeObjectURL(sourceUrl);
      resolve(canvas.toDataURL("image/webp", 0.88));
    };
    sourceImage.onerror = () => { URL.revokeObjectURL(sourceUrl); reject(new Error("图片读取失败，请换一张图片")); };
    sourceImage.src = sourceUrl;
  });
}

function App() {
  const [profiles, setProfiles] = useState(fallbackProfiles);
  const [papers, setPapers] = useState(() => initialPapers.map(paper => ({
    ...paper,
    abstract: fullPaperAbstracts[paper.id] || paper.abstract,
    pdfAsset: localPdfAssets[paper.id] || ""
  })));
  const [activeProfileKey, setActiveProfileKey] = useState("tongtong");
  const [view, setView] = useState("members");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [firstAuthorOnly, setFirstAuthorOnly] = useState(false);
  const [sort, setSort] = useState({ key: "year", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [following, setFollowing] = useState(false);
  const [detail, setDetail] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [toast, setToast] = useState("");
  const [adminAuth, setAdminAuth] = useState({ loading: false, authenticated: false, username: null, error: "" });
  const [loginPending, setLoginPending] = useState(false);
  const [memberEditorOpen, setMemberEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberSaving, setMemberSaving] = useState(false);
  const [memberError, setMemberError] = useState("");
  const profile = profiles[activeProfileKey] || Object.values(profiles)[0];

  const applyMembers = members => {
    const nextProfiles = Object.fromEntries(members.map(member => [member.id, {
      ...member,
      avatar: member.avatar || fallbackProfiles[member.id]?.avatar || ""
    }]));
    setProfiles(nextProfiles);
    const hashKey = members.find(member => `#${member.slug}` === window.location.hash)?.id;
    if (hashKey) {
      setActiveProfileKey(hashKey);
      if (view !== "admin") setView("profile");
    } else if (!nextProfiles[activeProfileKey] && members[0]) {
      setActiveProfileKey(members[0].id);
    }
  };

  const refreshMembers = async () => {
    const response = await fetch("/api/members", { credentials: "same-origin" });
    if (!response.ok) throw new Error("成员数据加载失败");
    const result = await response.json();
    applyMembers(result.members);
    return result.members;
  };
  const profilePapers = useMemo(() => papers.filter(paper => {
    const authors = paper.authors.split(/[,，]\s*/);
    return authors.includes(profile.name) || authors.includes(profile.chineseName);
  }), [papers, profile.name, profile.chineseName]);
  const profileYears = useMemo(() => [...new Set(profilePapers.map(paper => paper.year))].sort((a, b) => b - a), [profilePapers]);
  const openRate = profilePapers.length ? Math.round(profilePapers.filter(paper => paper.open).length / profilePapers.length * 100) : 0;

  const citationStats = useMemo(() => {
    const counts = profilePapers.map(p => p.citations).filter(Number.isFinite).sort((a, b) => b - a);
    return {
      total: counts.reduce((sum, value) => sum + value, 0),
      h: counts.filter((value, index) => value >= index + 1).length,
      i10: counts.filter(value => value >= 10).length
    };
  }, [profilePapers]);
  const citationUpdatedAt = profilePapers.map(p => p.citationUpdatedAt).filter(Boolean).sort().at(-1);
  const profileCollaborators = useMemo(() => {
    const counts = new Map();
    profilePapers.forEach(paper => {
      paper.authors.split(/[,，]\s*/).forEach(author => {
        if (author === profile.name || author === profile.chineseName) return;
        counts.set(author, (counts.get(author) || 0) + 1);
      });
    });
    const limit = activeProfileKey === "zhengwen" ? 8 : 3;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([name, count]) => ({
        name,
        count,
        key: Object.keys(profiles).find(key => profiles[key].name === name || profiles[key].chineseName === name)
      }));
  }, [activeProfileKey, profile.name, profile.chineseName, profilePapers]);

  const citationsByPublicationYear = [2023, 2024, 2025, 2026].map(y => ({
    y,
    v: profilePapers.filter(p => p.year === y).reduce((sum, p) => sum + (p.citations ?? 0), 0)
  }));

  useEffect(() => {
    const saved = localStorage.getItem("zlab-theme");
    if (saved === "dark") setTheme("dark");
    if (window.location.hash === "#admin") {
      setView("admin");
      return;
    }
    const profileFromHash = Object.entries(profiles).find(([, value]) => `#${value.slug}` === window.location.hash)?.[0];
    if (profileFromHash) {
      setActiveProfileKey(profileFromHash);
      setView("profile");
    }
  }, []);

  useEffect(() => {
    refreshMembers().catch(() => {});
  }, []);

  useEffect(() => {
    document.title = view === "profile" ? `${profile.name} · ZlabScholar` : view === "admin" ? "成果管理 · ZlabScholar" : "课题组成员 · ZlabScholar";
  }, [activeProfileKey, profile.name, view]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("zlab-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (view !== "admin") return;
    setAdminAuth(current => ({ ...current, loading: true, error: "" }));
    fetch("/api/auth/status", { credentials: "same-origin" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("管理员服务暂时不可用")))
      .then(result => setAdminAuth({ loading: false, authenticated: result.authenticated, username: result.username, error: "" }))
      .catch(error => setAdminAuth({ loading: false, authenticated: false, username: null, error: error.message }));
  }, [view]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profilePapers
      .filter(p => year === "all" || String(p.year) === year)
      .filter(p => !firstAuthorOnly || [profile.name, profile.chineseName].includes(p.authors.split(/[,，]\s*/)[0]))
      .filter(p => !q || [p.title, p.authors, p.venue, p.keywords.join(" ")].join(" ").toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort.key === "citations") {
          const aRecorded = Number.isFinite(a.citations);
          const bRecorded = Number.isFinite(b.citations);
          if (!aRecorded && !bRecorded) return 0;
          if (!aRecorded) return 1;
          if (!bRecorded) return -1;
        }
        const value = sort.key === "title" ? a.title.localeCompare(b.title) : a[sort.key] - b[sort.key];
        return sort.direction === "asc" ? value : -value;
      });
  }, [profilePapers, profile.name, profile.chineseName, query, year, firstAuthorOnly, sort]);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAPERS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPapers = visible.slice((safePage - 1) * PAPERS_PER_PAGE, safePage * PAPERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeProfileKey, query, year, firstAuthorOnly, sort.key, sort.direction]);

  const changeSort = key => setSort(s => ({ key, direction: s.key === key && s.direction === "desc" ? "asc" : "desc" }));
  const arrow = key => sort.key === key ? (sort.direction === "desc" ? " ↓" : " ↑") : "";

  const openProfile = key => {
    setActiveProfileKey(key);
    setView("profile");
    setQuery("");
    setYear("all");
    setFirstAuthorOnly(false);
    setFollowing(false);
    setDetail(null);
    window.history.replaceState(null, "", `#${profiles[key].slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMembers = () => {
    setView("members");
    setQuery("");
    setDetail(null);
    window.history.replaceState(null, "", "#members");
    document.title = "课题组成员 · ZlabScholar";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAdmin = () => {
    setView("admin");
    setQuery("");
    setDetail(null);
    window.history.replaceState(null, "", "#admin");
    document.title = "成果管理 · ZlabScholar";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loginAdmin = async event => {
    event.preventDefault();
    const loginForm = event.currentTarget;
    setLoginPending(true);
    setAdminAuth(current => ({ ...current, error: "" }));
    const form = new FormData(loginForm);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "登录失败");
      setAdminAuth({ loading: false, authenticated: true, username: result.username, error: "" });
      loginForm.reset();
    } catch (error) {
      setAdminAuth({ loading: false, authenticated: false, username: null, error: error.message });
    } finally {
      setLoginPending(false);
    }
  };

  const logoutAdmin = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    setAdminAuth({ loading: false, authenticated: false, username: null, error: "" });
    notify("已安全退出管理后台");
  };

  const openMemberEditor = member => {
    setEditingMember(member || null);
    setMemberError("");
    setMemberEditorOpen(true);
  };

  const saveMember = async event => {
    event.preventDefault();
    const memberForm = event.currentTarget;
    const form = new FormData(memberForm);
    const payload = {
      name: form.get("name"), chineseName: form.get("chineseName"), slug: form.get("slug"), group: form.get("group"),
      sortOrder: Number(form.get("sortOrder")), affiliation: form.get("affiliation"), affiliationUrl: form.get("affiliationUrl"),
      role: form.get("role"), roleCn: form.get("roleCn"), email: form.get("email"), emailNote: form.get("emailNote"),
      homepage: form.get("homepage"), orcid: form.get("orcid"), verified: form.get("verified") === "on",
      research: String(form.get("research") || "").split(/[,，\n]/).map(value => value.trim()).filter(Boolean),
      avatar: form.get("removeAvatar") === "on" ? "" : editingMember?.avatar || ""
    };
    setMemberSaving(true);
    setMemberError("");
    try {
      const avatarFile = form.get("avatar");
      if (avatarFile?.size) payload.avatar = await optimizeAvatarFile(avatarFile);
      const endpoint = editingMember ? `/api/admin/members/${encodeURIComponent(editingMember.id)}` : "/api/admin/members";
      const response = await fetch(endpoint, { method: editingMember ? "PUT" : "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "保存失败");
      await refreshMembers();
      setMemberEditorOpen(false);
      notify(editingMember ? "成员资料已更新" : "成员已添加");
    } catch (error) {
      setMemberError(error.message);
    } finally {
      setMemberSaving(false);
    }
  };

  const deleteMember = async member => {
    if (!window.confirm(`确定删除成员“${member.chineseName || member.name}”吗？`)) return;
    const response = await fetch(`/api/admin/members/${encodeURIComponent(member.id)}`, { method: "DELETE", credentials: "same-origin" });
    const result = await response.json();
    if (!response.ok) return notify(result.error || "删除失败");
    await refreshMembers();
    notify("成员已删除");
  };

  const storedAvatar = key => profiles[key]?.avatar || "";

  const authorList = authors => authors.split(/[,，]\s*/).map((author, index, list) => {
    const key = Object.keys(profiles).find(profileKey => profiles[profileKey].name === author || profiles[profileKey].chineseName === author);
    const separator = authors.includes("，") ? "，" : ", ";
    return <span key={author}>{key ? <button className="paper-author-link" onClick={() => openProfile(key)}>{author}</button> : author}{index < list.length - 1 ? separator : ""}</span>;
  });

  const addPaper = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPaper = {
      id: Date.now(),
      title: form.get("title"),
      authors: form.get("authors"),
      venue: form.get("venue"),
      year: Number(form.get("year")),
      citations: 0,
      open: form.get("open") === "on",
      doi: form.get("doi") || "待补充",
      keywords: [form.get("keyword") || "未分类"],
      abstract: "这是刚刚添加的演示论文，详细摘要待补充。"
    };
    setPapers(list => [newPaper, ...list]);
    setCurrentPage(1);
    setAddOpen(false);
    notify("论文已添加到演示列表");
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="nav-inner">
          <a className="brand" href="#members" aria-label="ZlabScholar 首页" onClick={event => {event.preventDefault();openMembers();}}>
            <span className="brand-mark">Z</span><span>Zlab<span>Scholar</span></span>
          </a>
          <label className="global-search">
            <SearchIcon />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索论文、作者或关键词" aria-label="搜索论文、作者或关键词" />
            {query && <button onClick={() => setQuery("")} aria-label="清空搜索">×</button>}
          </label>
          <div className="nav-actions">
            <button className="icon-button theme-toggle" onClick={() => setTheme(t => t === "light" ? "dark" : "light")} title={theme === "light" ? "切换到暗色主题" : "切换到亮色主题"} aria-label={theme === "light" ? "切换到暗色主题" : "切换到亮色主题"}>{theme === "light" ? <MoonIcon/> : <SunIcon/>}</button>
            <button className="text-button" onClick={openMembers}>课题组成员</button>
            <button className="primary-button compact" onClick={openAdmin}>管理成果</button>
          </div>
        </div>
      </header>

      <main id="top">
        {view === "members" ? <>
          <section className="members-hero">
            <div className="container"><span className="eyebrow">ZLAB RESEARCH GROUP</span><h1>课题组成员</h1><p>汇聚不同研究方向的教师与研究生，展示成员信息与学术成果。</p></div>
          </section>
          <div className="container members-page">
            {[{title:"教师",subtitle:"Faculty",group:"faculty"},{title:"博士生",subtitle:"Ph.D. Students",group:"phd"},{title:"研究生",subtitle:"Graduate Students",group:"graduate"}].map(group => {
              const keys = Object.values(profiles).filter(member => member.group === group.group).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)).map(member => member.id);
              return (
              <section className="member-group" key={group.title}>
                <div className="member-group-heading"><div><h2>{group.title}</h2><span>{group.subtitle}</span></div><em>{keys.length} 人</em></div>
                {keys.length ? <div className="member-grid">{keys.map(key => {
                  const member = profiles[key];
                  const picture = storedAvatar(key);
                  return <article className="member-card" key={key}>
                    <button className="member-photo" onClick={() => openProfile(key)} aria-label={`进入${member.name}的主页`}>
                      {picture ? <img src={picture} alt={`${member.name}头像`}/> : <span>{member.name.split(" ").map(part => part[0]).join("")}</span>}
                    </button>
                    <div className="member-card-body"><button className="member-name" onClick={() => openProfile(key)}>{member.chineseName} <span>{member.name}</span></button><p><b>研究领域：</b>{member.research.join("、")}</p></div>
                  </article>;
                })}</div> : <div className="member-empty"><span>＋</span><div><strong>成员信息待添加</strong><p>后续可以在这里添加研究生及其论文成果。</p></div></div>}
              </section>
            )})}
          </div>
        </> : view === "admin" ? <section className="admin-page">
          <div className="container admin-container">
            <div className="admin-heading"><span className="eyebrow">ZLABSCHOLAR ADMIN</span><h1>成果管理</h1><p>公开页面无需登录，成员和论文的修改仅限管理员操作。</p></div>
            {adminAuth.loading ? <div className="admin-card admin-loading">正在检查登录状态……</div>
              : adminAuth.authenticated ? <div className="admin-card admin-dashboard">
                <div><span className="admin-badge">管理员已登录</span><h2>欢迎，{adminAuth.username}</h2><p>你可以在这里维护实验室成员资料，保存后公开页面会立即更新。</p></div>
                <button type="button" className="text-button admin-logout" onClick={logoutAdmin}>退出登录</button>
                <section className="member-manager">
                  <div className="manager-heading"><div><h3>实验室人员</h3><span>共 {Object.keys(profiles).length} 人</span></div><button type="button" className="primary-button" onClick={() => openMemberEditor(null)}>＋ 添加人员</button></div>
                  <div className="manager-list">{Object.values(profiles).sort((a,b) => ({faculty:1,phd:2,graduate:3}[a.group] - {faculty:1,phd:2,graduate:3}[b.group]) || a.sortOrder - b.sortOrder).map(member => <article className="manager-member" key={member.id}>
                    <span className="manager-avatar">{member.avatar ? <img src={member.avatar} alt=""/> : member.name.split(" ").map(part => part[0]).join("")}</span>
                    <div><strong>{member.chineseName || member.name}</strong><span>{member.name} · {{faculty:"教师",phd:"博士生",graduate:"研究生"}[member.group]}</span></div>
                    <div className="manager-actions"><button type="button" onClick={() => openMemberEditor(member)}>编辑</button><button type="button" className="danger" onClick={() => deleteMember(member)}>删除</button></div>
                  </article>)}</div>
                </section>
              </div> : <form className="admin-card admin-login" onSubmit={loginAdmin}>
                <h2>管理员登录</h2><p>本站不开放注册，仅管理员账号可以进入。</p>
                <label>管理员账号<input name="username" autoComplete="username" required/></label>
                <label>密码<input name="password" type="password" autoComplete="current-password" required/></label>
                {adminAuth.error && <div className="admin-error" role="alert">{adminAuth.error}</div>}
                <button className="primary-button" type="submit" disabled={loginPending}>{loginPending ? "正在登录……" : "登录"}</button>
              </form>}
          </div>
        </section> : <>
        <section className="profile-section">
          <div className="container profile-grid">
            <div className="avatar">
              {profile.avatar
                ? <img src={profile.avatar} alt={`${profile.name}头像`}/>
                : <svg viewBox="0 0 120 120" role="img" aria-label={`${profile.name}默认头像`}><circle cx="60" cy="60" r="60" fill="#e9e9ff"/><circle cx="60" cy="43" r="22" fill="#6c63d9"/><path d="M22 106c5-28 20-42 38-42s33 14 38 42" fill="#5148bd"/><path d="M36 39c4-19 44-22 49 5-13-3-20-10-24-17-3 8-12 13-25 12" fill="#27234d"/></svg>}
            </div>
            <div className="profile-main">
              <div className="name-row"><h1>{profile.name}</h1><span>{profile.chineseName}</span></div>
              <p className="affiliation">{profile.affiliationUrl ? <a href={profile.affiliationUrl} target="_blank" rel="noreferrer">{profile.affiliation}</a> : <span>{profile.affiliation}</span>}</p>
              <p className="role">{profile.role} <small>{profile.roleCn}</small></p>
              <div className={`verified${profile.verified ? "" : " pending"}`}><span>{profile.verified ? <CheckIcon/> : "i"}</span><span className="verified-copy">{profile.email} <small>{profile.emailNote}</small></span></div>
              <ResearchLinks
                topics={profile.research}
                onSelect={setQuery}
              />
              {(profile.homepage || profile.orcid) && <div className="profile-links">
                {profile.homepage && <a href={profile.homepage} target="_blank" rel="noreferrer">Homepage ↗</a>}
                {profile.orcid && <a href={profile.orcid} target="_blank" rel="noreferrer">ORCID ↗</a>}
              </div>}
            </div>
            <button className={following ? "follow-button active" : "follow-button"} onClick={() => {setFollowing(v => !v); notify(following ? `已取消关注${profile.chineseName || profile.name}` : `已关注${profile.chineseName || profile.name}`);}}>{following ? "✓ Following" : "+ Follow"}</button>
          </div>
        </section>

        <div className="container content-grid">
          <section className="papers-panel">
            <div className="section-heading"><div><h2>论文成果</h2><p>共 {profilePapers.length} 篇 · 筛选结果 {visible.length} 篇{visible.length > 0 && ` · 第 ${safePage}/${totalPages} 页`}</p><p className="quartile-standard" title={QUARTILE_STANDARD}>分区口径：{QUARTILE_STANDARD}</p></div></div>
            <div className="filters">
              <label className="paper-search"><SearchIcon/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="在成果中搜索关键词"/></label>
              <select value={year} onChange={e => setYear(e.target.value)} aria-label="按年份筛选"><option value="all">全部年份</option>{profileYears.map(y => <option key={y}>{y}</option>)}</select>
              <button type="button" className={firstAuthorOnly ? "first-author-toggle active" : "first-author-toggle"} aria-pressed={firstAuthorOnly} onClick={() => setFirstAuthorOnly(value => !value)} title={firstAuthorOnly ? "显示全部论文" : "只显示第一作者论文"}>第一作者</button>
            </div>
            <div className="paper-table-head"><input type="checkbox" aria-label="选择全部论文"/><span>标题</span><button type="button" className={sort.key === "citations" ? "active" : ""} onClick={() => changeSort("citations")} aria-label={`按引用次数${sort.key === "citations" && sort.direction === "desc" ? "升序" : "降序"}排列`}>引用次数{arrow("citations")}</button><button type="button" className={sort.key === "year" ? "active" : ""} onClick={() => changeSort("year")} aria-label={`按年份${sort.key === "year" && sort.direction === "desc" ? "升序" : "降序"}排列`}>年份{arrow("year")}</button><span className="quartile-heading" title={QUARTILE_STANDARD}>期刊分区</span><span className="download-heading">下载</span></div>
            <div className="paper-list">
              {paginatedPapers.map(paper => (
                <article className="paper" key={paper.id}>
                  <input className="paper-select" type="checkbox" aria-label={`选择论文：${paper.title}`}/>
                  <div className="paper-main">
                    <button className="paper-title" onClick={() => setDetail(paper)}>{paper.title}</button>
                    <p className="paper-authors">{authorList(paper.authors)}</p>
                    <p className="paper-meta"><span className="paper-venue">{paper.venue}</span>{paper.open && <b>OPEN ACCESS</b>}</p>
                  </div>
                  <span className="paper-citations">{paper.citations ?? "—"}</span>
                  <span className="paper-year">{paper.year}</span>
                  <div className="paper-quartiles" aria-label={`${paper.venue}期刊分区`}>
                    <span>{journalQuartiles(paper.venue).sci}</span>
                    <span>{journalQuartiles(paper.venue).cas}</span>
                  </div>
                  {paper.pdfAsset
                    ? <a className="paper-download" href={paper.pdfAsset} download={paper.pdfAsset.split("/").at(-1)} aria-label={`下载论文：${paper.title}`} title="下载本地 PDF">下载</a>
                    : <button className="paper-download" type="button" disabled aria-label={`暂无本地文件：${paper.title}`} title="暂无本地 PDF">下载</button>}
                </article>
              ))}
              {!visible.length && <div className="empty"><SearchIcon/><h3>未找到匹配论文</h3><p>请尝试更换关键词、年份或第一作者筛选。</p><button onClick={() => {setQuery("");setYear("all");setFirstAuthorOnly(false);}}>清除筛选</button></div>}
            </div>
            {totalPages > 1 && <nav className="pagination" aria-label="论文分页">
              <button disabled={safePage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))}>上一页</button>
              <div>{Array.from({length: totalPages}, (_, index) => index + 1).map(page => <button className={page === safePage ? "active" : ""} aria-current={page === safePage ? "page" : undefined} key={page} onClick={() => setCurrentPage(page)}>{page}</button>)}</div>
              <button disabled={safePage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}>下一页</button>
            </nav>}
          </section>

          <aside className="stats-column">
            <section className="stat-card">
              <div className="card-title"><h3>学术影响力</h3><span>当前数据</span></div>
              <div className="metric-grid"><div><strong>{citationStats.total}</strong><span>已收录引用</span></div><div><strong>{citationStats.h}</strong><span>h-index（已收录）</span></div><div><strong>{citationStats.i10}</strong><span>i10（已收录）</span></div></div>
              <div className="chart-title"><span>按论文发表年份引用</span><span>2023—2026</span></div>
              <div className="bar-chart" aria-label="按论文发表年份统计引用次数">
                {citationsByPublicationYear.map(x => <div className="bar-group" key={x.y}><span className="bar-value">{x.v}</span><div className="bar" style={{height: `${Math.max(2, x.v * 1.7)}px`}}/><span>{x.y}</span></div>)}
              </div>
              <p className="demo-note">引用数据来自公开网站，未收录显示“—”{citationUpdatedAt && <><br/>最近核对：{citationUpdatedAt}</>}</p>
            </section>
            <section className="stat-card compact-card"><h3>成果概览</h3><div className="overview-row"><span>论文总数</span><strong>{profilePapers.length} 篇</strong></div><div className="overview-row"><span>开放获取</span><strong>{openRate}%</strong></div><div className="progress"><i style={{width:`${openRate}%`}}/></div></section>
            <section className="stat-card compact-card"><h3>主要合作者</h3>{profileCollaborators.map((collaborator, index) => <button className="collaborator" key={collaborator.name} onClick={() => collaborator.key ? openProfile(collaborator.key) : notify(`${collaborator.name}的作者主页待创建`)}><span className={`mini-avatar c${index % 3}`}>{collaborator.name[0]}</span><span><b>{collaborator.name}</b><small>{collaborator.key ? "查看成员主页" : "Co-author"}</small></span><em>{collaborator.count} 篇合作</em></button>)}</section>
          </aside>
        </div>
        </>}
      </main>

      <footer><div className="container"><span>ZlabScholar · Zlab 实验室成果展示</span><span>论文信息依据出版社页面整理 · 引用数据可能随来源更新</span></div></footer>

      {detail && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setDetail(null)}><div className="modal detail-modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={() => setDetail(null)}><CloseIcon/></button><span className="eyebrow">论文详情 · {detail.year}</span><h2>{detail.title}</h2><p className="detail-authors">{detail.authors}</p><div className="detail-info"><div><span>发表刊物</span><b>{detail.venue}</b></div><div><span>引用次数</span><b>{detail.citations ?? "未收录"}</b></div><div><span>开放获取</span><b>{detail.open ? "是" : "否"}</b></div></div>{detail.citationUpdatedAt && <p className="demo-note">引用数据核对于 {detail.citationUpdatedAt}</p>}<h4>摘要</h4><p className="abstract">{detail.abstract}</p><div className="doi"><span>DOI</span><code>{detail.doi}</code></div><div className="modal-actions"><button onClick={() => notify("引用已复制（演示）")}>复制引用</button><button className="primary-button" onClick={() => detail.doi.startsWith("10.") ? window.open(`https://doi.org/${detail.doi}`, "_blank", "noopener,noreferrer") : notify("该论文 DOI 尚未公开")}>访问论文 ↗</button></div></div></div>}

      {addOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setAddOpen(false)}><form className="modal add-modal" onSubmit={addPaper}><button type="button" className="modal-close" onClick={() => setAddOpen(false)}><CloseIcon/></button><span className="eyebrow">添加成果 · {profile.name}</span><h2>添加一篇论文</h2><p>当前为本地演示数据，刷新页面后不会保留。</p><label>英文标题<input name="title" required placeholder="Paper title"/></label><label>作者列表<input name="authors" required defaultValue={profile.name} placeholder={`${profile.name}, ...`}/></label><div className="form-grid"><label>期刊或会议<input name="venue" required placeholder="Journal name"/></label><label>发表年份<input name="year" type="number" min="1900" max="2030" defaultValue="2026" required/></label></div><div className="form-grid"><label>关键词<input name="keyword" placeholder="AI for Science"/></label><label>DOI<input name="doi" placeholder="10.xxxx/xxxx"/></label></div><label className="checkbox"><input name="open" type="checkbox"/> 该论文为开放获取</label><div className="modal-actions"><button type="button" onClick={() => setAddOpen(false)}>取消</button><button className="primary-button" type="submit">添加论文</button></div></form></div>}
      {memberEditorOpen && <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && !memberSaving && setMemberEditorOpen(false)}><form className="modal member-modal" onSubmit={saveMember}>
        <button type="button" className="modal-close" aria-label="关闭人员编辑" onClick={() => setMemberEditorOpen(false)} disabled={memberSaving}><CloseIcon/></button>
        <span className="eyebrow">人员管理</span><h2>{editingMember ? "编辑成员资料" : "添加实验室人员"}</h2><p className="form-intro">带 * 的项目为必填。研究方向可使用逗号分隔。</p>
        <div className="form-grid"><label>中文名<input name="chineseName" defaultValue={editingMember?.chineseName || ""}/></label><label>英文名 *<input name="name" required defaultValue={editingMember?.name || ""} placeholder="English Name"/></label></div>
        <div className="form-grid"><label>主页地址 *<input name="slug" required defaultValue={editingMember?.slug || ""} placeholder="firstname-lastname" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"/></label><label>成员分组 *<select name="group" defaultValue={editingMember?.group || "graduate"}><option value="faculty">教师</option><option value="phd">博士生</option><option value="graduate">研究生</option></select></label></div>
        <div className="form-grid"><label>英文身份<input name="role" defaultValue={editingMember?.role || ""} placeholder="Ph.D. Student"/></label><label>中文身份<input name="roleCn" defaultValue={editingMember?.roleCn || ""} placeholder="博士研究生"/></label></div>
        <label>单位<input name="affiliation" defaultValue={editingMember?.affiliation || ""}/></label>
        <label>单位网址<input name="affiliationUrl" type="url" defaultValue={editingMember?.affiliationUrl || ""} placeholder="https://"/></label>
        <div className="form-grid"><label>邮箱<input name="email" defaultValue={editingMember?.email || ""}/></label><label>邮箱说明<input name="emailNote" defaultValue={editingMember?.emailNote || ""} placeholder="联系邮箱"/></label></div>
        <label>研究方向<textarea name="research" rows="3" defaultValue={(editingMember?.research || []).join("，")}/></label>
        <label>成员头像<input name="avatar" type="file" accept="image/jpeg,image/png,image/webp"/></label>
        {editingMember?.avatar && <div className="avatar-edit-row"><img src={editingMember.avatar} alt="当前成员头像"/><label className="checkbox"><input name="removeAvatar" type="checkbox"/> 删除当前头像</label></div>}
        <div className="form-grid"><label>个人主页<input name="homepage" type="url" defaultValue={editingMember?.homepage || ""} placeholder="https://"/></label><label>ORCID<input name="orcid" type="url" defaultValue={editingMember?.orcid || ""} placeholder="https://orcid.org/"/></label></div>
        <div className="form-grid compact-fields"><label>排序值<input name="sortOrder" type="number" min="0" max="9999" defaultValue={editingMember?.sortOrder ?? 0}/></label><label className="checkbox"><input name="verified" type="checkbox" defaultChecked={editingMember?.verified || false}/> 邮箱信息已核验</label></div>
        {memberError && <div className="admin-error" role="alert">{memberError}</div>}
        <div className="modal-actions"><button type="button" onClick={() => setMemberEditorOpen(false)} disabled={memberSaving}>取消</button><button className="primary-button" type="submit" disabled={memberSaving}>{memberSaving ? "正在保存……" : "保存成员"}</button></div>
      </form></div>}
      {toast && <div className="toast"><CheckIcon/>{toast}</div>}
    </div>
  );
}

export default App;
