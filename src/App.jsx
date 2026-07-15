"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "../app/globals.css";

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
    doi: "Pending assignment",
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
  }
];

const profiles = {
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
    verified: true,
    research: ["Complex Systems", "Amorphous Materials", "AI for Science"],
    collaborators: [{n:"Wen Zheng",c:6,key:"zhengwen"},{n:"Xinyao Wang",c:3,key:"xinyao"},{n:"Xueyu Liu",c:2}]
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
    verified: false,
    research: ["Systems Engineering", "Manned/Unmanned Collaboration", "Computer Vision"],
    collaborators: [{n:"Tongtong Shen",c:3,key:"tongtong"},{n:"Wen Zheng",c:3,key:"zhengwen"},{n:"Xueyu Liu",c:2}]
  },
  zhengwen: {
    slug: "wen-zheng",
    name: "Wen Zheng",
    chineseName: "郑文",
    affiliation: "单位信息待补充",
    affiliationUrl: "",
    role: "Faculty Member",
    roleCn: "教师",
    email: "邮箱待补充",
    emailNote: "公开信息待完善",
    verified: false,
    research: ["Machine Learning", "AI for Science", "Computer Vision"],
    collaborators: [{n:"Tongtong Shen",c:5,key:"tongtong"},{n:"Xinyao Wang",c:3,key:"xinyao"},{n:"Zhuohang Li",c:2,key:"zhuohang"}]
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
    verified: false,
    research: ["Computer Vision", "Remote Sensing", "AI for Science"],
    collaborators: [{n:"Tongtong Shen",c:2,key:"tongtong"},{n:"Xinyao Wang",c:2,key:"xinyao"},{n:"Wen Zheng",c:2,key:"zhengwen"}]
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
    research: ["研究领域待补充"],
    collaborators: []
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
const CameraIcon = () => <svg width="36" height="32" viewBox="0 0 36 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 9.5 15.5 6h9L27 9.5h3.5a3 3 0 0 1 3 3V26a3 3 0 0 1-3 3h-20a3 3 0 0 1-3-3V12.5a3 3 0 0 1 3-3H13Z"/><circle cx="20.5" cy="19" r="5"/><path d="M7 2v10M2 7h10"/></svg>;

function App() {
  const [papers, setPapers] = useState(initialPapers);
  const [activeProfileKey, setActiveProfileKey] = useState("tongtong");
  const [view, setView] = useState("members");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState({ key: "year", direction: "desc" });
  const [following, setFollowing] = useState(false);
  const [detail, setDetail] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [toast, setToast] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const avatarInputRef = useRef(null);
  const profile = profiles[activeProfileKey];
  const profilePapers = useMemo(() => papers.filter(paper => {
    const authors = paper.authors.split(/[,，]\s*/);
    return authors.includes(profile.name) || authors.includes(profile.chineseName);
  }), [papers, profile.name, profile.chineseName]);
  const openRate = profilePapers.length ? Math.round(profilePapers.filter(paper => paper.open).length / profilePapers.length * 100) : 0;

  const citationStats = useMemo(() => {
    const counts = profilePapers.map(p => p.citations).filter(Number.isFinite).sort((a, b) => b - a);
    return {
      total: counts.reduce((sum, value) => sum + value, 0),
      h: counts.filter((value, index) => value >= index + 1).length,
      i10: counts.filter(value => value >= 10).length
    };
  }, [profilePapers]);

  const citationsByPublicationYear = [2023, 2024, 2025, 2026].map(y => ({
    y,
    v: profilePapers.filter(p => p.year === y).reduce((sum, p) => sum + (p.citations ?? 0), 0)
  }));

  useEffect(() => {
    const saved = localStorage.getItem("zlab-theme");
    if (saved === "dark") setTheme("dark");
    const profileFromHash = Object.entries(profiles).find(([, value]) => `#${value.slug}` === window.location.hash)?.[0];
    if (profileFromHash) {
      setActiveProfileKey(profileFromHash);
      setView("profile");
    }
  }, []);

  useEffect(() => {
    const legacyAvatar = activeProfileKey === "tongtong" ? localStorage.getItem("zlab-avatar") : "";
    setAvatarImage(localStorage.getItem(`zlab-avatar-${activeProfileKey}`) || legacyAvatar || "");
    document.title = view === "profile" ? `${profile.name} · ZlabScholar` : "课题组成员 · ZlabScholar";
  }, [activeProfileKey, profile.name, view]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("zlab-theme", theme);
  }, [theme]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const uploadAvatar = event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      notify("请选择 JPG、PNG 或 WebP 图片");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notify("原始图片不能超过 10 MB");
      return;
    }
    const sourceUrl = URL.createObjectURL(file);
    const sourceImage = new Image();
    sourceImage.onload = () => {
      const cropSize = Math.min(sourceImage.naturalWidth, sourceImage.naturalHeight);
      const outputSize = Math.min(640, cropSize);
      const offsetX = (sourceImage.naturalWidth - cropSize) / 2;
      const offsetY = (sourceImage.naturalHeight - cropSize) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(sourceImage, offsetX, offsetY, cropSize, cropSize, 0, 0, outputSize, outputSize);
      const optimizedImage = canvas.toDataURL("image/webp", 0.9);
      URL.revokeObjectURL(sourceUrl);
      setAvatarImage(optimizedImage);
      try {
        localStorage.setItem(`zlab-avatar-${activeProfileKey}`, optimizedImage);
        notify("头像已裁剪并压缩");
      } catch {
        notify("头像已更新，但无法在刷新后保留");
      }
    };
    sourceImage.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      notify("图片读取失败，请换一张图片");
    };
    sourceImage.src = sourceUrl;
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profilePapers
      .filter(p => year === "all" || String(p.year) === year)
      .filter(p => !q || [p.title, p.authors, p.venue, p.keywords.join(" ")].join(" ").toLowerCase().includes(q))
      .sort((a, b) => {
        const value = sort.key === "title" ? a.title.localeCompare(b.title) : a[sort.key] - b[sort.key];
        return sort.direction === "asc" ? value : -value;
      });
  }, [profilePapers, query, year, sort]);

  const changeSort = key => setSort(s => ({ key, direction: s.key === key && s.direction === "desc" ? "asc" : "desc" }));
  const arrow = key => sort.key === key ? (sort.direction === "desc" ? " ↓" : " ↑") : "";

  const openProfile = key => {
    setActiveProfileKey(key);
    setView("profile");
    setQuery("");
    setYear("all");
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

  const storedAvatar = key => localStorage.getItem(`zlab-avatar-${key}`) || (key === "tongtong" ? localStorage.getItem("zlab-avatar") : "") || "";

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
            <button className="icon-button" onClick={() => setTheme(t => t === "light" ? "dark" : "light")} title="切换主题">{theme === "light" ? <MoonIcon/> : <SunIcon/>}</button>
            <button className="text-button" onClick={openMembers}>课题组成员</button>
            <button className="text-button" onClick={() => notify("登录功能将在后续版本开放")}>登录</button>
            <button className="primary-button compact" onClick={() => notify("成果管理功能将在后续版本开放")}>管理成果</button>
          </div>
        </div>
      </header>

      <main id="top">
        {view === "members" ? <>
          <section className="members-hero">
            <div className="container"><span className="eyebrow">ZLAB RESEARCH GROUP</span><h1>课题组成员</h1><p>汇聚不同研究方向的教师与研究生，展示成员信息与学术成果。</p></div>
          </section>
          <div className="container members-page">
            {[{title:"教师",subtitle:"Faculty",keys:["xinyao","zhengwen"]},{title:"博士生",subtitle:"Ph.D. Students",keys:["tongtong","zhuohang","yuanyi"]},{title:"研究生",subtitle:"Graduate Students",keys:[]}].map(group => (
              <section className="member-group" key={group.title}>
                <div className="member-group-heading"><div><h2>{group.title}</h2><span>{group.subtitle}</span></div><em>{group.keys.length} 人</em></div>
                {group.keys.length ? <div className="member-grid">{group.keys.map(key => {
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
            ))}
          </div>
        </> : <>
        <section className="profile-section">
          <div className="container profile-grid">
            <div className="avatar">
              {avatarImage
                ? <img src={avatarImage} alt={`${profile.name}头像`}/>
                : <svg viewBox="0 0 120 120" role="img" aria-label={`${profile.name}默认头像`}><circle cx="60" cy="60" r="60" fill="#e9e9ff"/><circle cx="60" cy="43" r="22" fill="#6c63d9"/><path d="M22 106c5-28 20-42 38-42s33 14 38 42" fill="#5148bd"/><path d="M36 39c4-19 44-22 49 5-13-3-20-10-24-17-3 8-12 13-25 12" fill="#27234d"/></svg>}
              <input ref={avatarInputRef} className="avatar-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar}/>
              <button className="avatar-upload" type="button" aria-label="上传头像图片" title="上传头像图片" onClick={() => avatarInputRef.current?.click()}><CameraIcon/></button>
            </div>
            <div className="profile-main">
              <div className="name-row"><h1>{profile.name}</h1><span>{profile.chineseName}</span></div>
              <p className="affiliation">{profile.affiliationUrl ? <a href={profile.affiliationUrl} target="_blank" rel="noreferrer">{profile.affiliation}</a> : <span>{profile.affiliation}</span>}</p>
              <p className="role">{profile.role} <small>{profile.roleCn}</small></p>
              <div className={`verified${profile.verified ? "" : " pending"}`}><span>{profile.verified ? <CheckIcon/> : "i"}</span><span className="verified-copy">{profile.email} <small>{profile.emailNote}</small></span></div>
              <div className="research-links">{profile.research.map(topic => <button key={topic} onClick={() => setQuery(topic)}>{topic}</button>)}</div>
              <div className="profile-links">
                <button onClick={() => notify("个人主页链接为演示入口")}>Homepage ↗</button>
                <button onClick={() => notify("ORCID 链接为演示入口")}>ORCID ↗</button>
              </div>
            </div>
            <button className={following ? "follow-button active" : "follow-button"} onClick={() => {setFollowing(v => !v); notify(following ? `已取消关注${profile.chineseName || profile.name}` : `已关注${profile.chineseName || profile.name}`);}}>{following ? "✓ Following" : "+ Follow"}</button>
          </div>
        </section>

        <div className="container content-grid">
          <section className="papers-panel">
            <div className="section-heading"><div><h2>论文成果</h2><p>共 {profilePapers.length} 篇 · 当前显示 {visible.length} 篇</p></div><button className="primary-button" onClick={() => setAddOpen(true)}>＋ 添加论文</button></div>
            <div className="filters">
              <label className="paper-search"><SearchIcon/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="在成果中搜索关键词"/></label>
              <select value={year} onChange={e => setYear(e.target.value)} aria-label="按年份筛选"><option value="all">全部年份</option>{[2026,2025,2024,2023].map(y => <option key={y}>{y}</option>)}</select>
            </div>
            <div className="paper-table-head"><input type="checkbox" aria-label="选择全部论文"/><span>标题</span><span>引用次数</span><span>年份</span></div>
            <div className="paper-list">
              {visible.map(paper => (
                <article className="paper" key={paper.id}>
                  <input className="paper-select" type="checkbox" aria-label={`选择论文：${paper.title}`}/>
                  <div className="paper-main">
                    <button className="paper-title" onClick={() => setDetail(paper)}>{paper.title}</button>
                    <p className="paper-authors">{authorList(paper.authors)}</p>
                    <p className="paper-meta"><span className="paper-venue">{paper.venue}</span>{paper.open && <b>OPEN ACCESS</b>}</p>
                  </div>
                  <span className="paper-citations">{paper.citations ?? "—"}</span>
                  <span className="paper-year">{paper.year}</span>
                </article>
              ))}
              {!visible.length && <div className="empty"><SearchIcon/><h3>未找到匹配论文</h3><p>请尝试更换关键词或年份筛选。</p><button onClick={() => {setQuery("");setYear("all");}}>清除筛选</button></div>}
            </div>
          </section>

          <aside className="stats-column">
            <section className="stat-card">
              <div className="card-title"><h3>学术影响力</h3><span>当前数据</span></div>
              <div className="metric-grid"><div><strong>{citationStats.total}</strong><span>已收录引用</span></div><div><strong>{citationStats.h}</strong><span>h-index（已收录）</span></div><div><strong>{citationStats.i10}</strong><span>i10（已收录）</span></div></div>
              <div className="chart-title"><span>按论文发表年份引用</span><span>2023—2026</span></div>
              <div className="bar-chart" aria-label="按论文发表年份统计引用次数">
                {citationsByPublicationYear.map(x => <div className="bar-group" key={x.y}><span className="bar-value">{x.v}</span><div className="bar" style={{height: `${Math.max(2, x.v * 1.7)}px`}}/><span>{x.y}</span></div>)}
              </div>
              <p className="demo-note">引用数据来自公开网站，未收录显示“—”</p>
            </section>
            <section className="stat-card compact-card"><h3>成果概览</h3><div className="overview-row"><span>论文总数</span><strong>{profilePapers.length} 篇</strong></div><div className="overview-row"><span>开放获取</span><strong>{openRate}%</strong></div><div className="progress"><i style={{width:`${openRate}%`}}/></div></section>
            <section className="stat-card compact-card"><h3>主要合作者</h3>{profile.collaborators.map((x,i)=><button className="collaborator" key={x.n} onClick={()=>x.key ? openProfile(x.key) : notify(`${x.n}的作者主页待创建`)}><span className={`mini-avatar c${i}`}>{x.n[0]}</span><span><b>{x.n}</b><small>{x.key ? "查看成员主页" : "Co-author"}</small></span><em>{x.c} 篇合作</em></button>)}</section>
          </aside>
        </div>
        </>}
      </main>

      <footer><div className="container"><span>ZlabScholar · Zlab 实验室成果展示</span><span>论文信息依据出版社页面整理 · 引用数据可能随来源更新</span></div></footer>

      {detail && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setDetail(null)}><div className="modal detail-modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={() => setDetail(null)}><CloseIcon/></button><span className="eyebrow">论文详情 · {detail.year}</span><h2>{detail.title}</h2><p className="detail-authors">{detail.authors}</p><div className="detail-info"><div><span>发表刊物</span><b>{detail.venue}</b></div><div><span>引用次数</span><b>{detail.citations ?? "未收录"}</b></div><div><span>开放获取</span><b>{detail.open ? "是" : "否"}</b></div></div><h4>摘要</h4><p className="abstract">{detail.abstract}</p><div className="doi"><span>DOI</span><code>{detail.doi}</code></div><div className="modal-actions"><button onClick={() => notify("引用已复制（演示）")}>复制引用</button><button className="primary-button" onClick={() => detail.doi.startsWith("10.") ? window.open(`https://doi.org/${detail.doi}`, "_blank", "noopener,noreferrer") : notify("该论文 DOI 尚未公开")}>访问论文 ↗</button></div></div></div>}

      {addOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setAddOpen(false)}><form className="modal add-modal" onSubmit={addPaper}><button type="button" className="modal-close" onClick={() => setAddOpen(false)}><CloseIcon/></button><span className="eyebrow">添加成果 · {profile.name}</span><h2>添加一篇论文</h2><p>当前为本地演示数据，刷新页面后不会保留。</p><label>英文标题<input name="title" required placeholder="Paper title"/></label><label>作者列表<input name="authors" required defaultValue={profile.name} placeholder={`${profile.name}, ...`}/></label><div className="form-grid"><label>期刊或会议<input name="venue" required placeholder="Journal name"/></label><label>发表年份<input name="year" type="number" min="1900" max="2030" defaultValue="2026" required/></label></div><div className="form-grid"><label>关键词<input name="keyword" placeholder="AI for Science"/></label><label>DOI<input name="doi" placeholder="10.xxxx/xxxx"/></label></div><label className="checkbox"><input name="open" type="checkbox"/> 该论文为开放获取</label><div className="modal-actions"><button type="button" onClick={() => setAddOpen(false)}>取消</button><button className="primary-button" type="submit">添加论文</button></div></form></div>}
      {toast && <div className="toast"><CheckIcon/>{toast}</div>}
    </div>
  );
}

export default App;
