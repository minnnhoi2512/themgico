USE [master]
GO
/****** Object:  Database [Themgico]    Script Date: 5/23/2024 6:52:17 PM ******/
CREATE DATABASE [Themgico]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Themgico', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Themgico.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Themgico_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Themgico_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Themgico] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Themgico].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Themgico] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Themgico] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Themgico] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Themgico] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Themgico] SET ARITHABORT OFF 
GO
ALTER DATABASE [Themgico] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [Themgico] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Themgico] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Themgico] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Themgico] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Themgico] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Themgico] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Themgico] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Themgico] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Themgico] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Themgico] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Themgico] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Themgico] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Themgico] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Themgico] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Themgico] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Themgico] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Themgico] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Themgico] SET  MULTI_USER 
GO
ALTER DATABASE [Themgico] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Themgico] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Themgico] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Themgico] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Themgico] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Themgico] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Themgico] SET QUERY_STORE = ON
GO
ALTER DATABASE [Themgico] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Themgico]
GO
/****** Object:  Table [dbo].[Accounts]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Accounts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[email] [varchar](100) NULL,
	[password] [varchar](100) NULL,
	[phone] [char](15) NULL,
	[role] [varchar](20) NULL,
	[status] [bit] NULL,
 CONSTRAINT [PK_Accounts] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[categoryID] [int] IDENTITY(1,1) NOT NULL,
	[categoryDescription] [nvarchar](500) NULL,
	[name] [nvarchar](250) NULL,
 CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED 
(
	[categoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[phone] [char](10) NULL,
	[point] [decimal](10, 2) NULL,
 CONSTRAINT [PK_Customers_1] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[News]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[News](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](100) NULL,
	[content] [nvarchar](max) NULL,
	[createDate] [date] NULL,
	[author] [nvarchar](50) NULL,
	[image] [nvarchar](max) NULL,
	[status] [bit] NULL,
 CONSTRAINT [PK_News] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[orderID] [int] NOT NULL,
	[productID] [int] NOT NULL,
	[quantity] [int] NOT NULL,
	[status] [nvarchar](50) NULL,
	[orderTime] [smalldatetime] NOT NULL,
 CONSTRAINT [PK_OrderDetails] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tablenumber] [int] NULL,
	[mode] [nvarchar](50) NULL,
	[numberguest] [int] NULL,
	[orderdate] [smalldatetime] NOT NULL,
	[status] [nvarchar](50) NULL,
	[Total] [decimal](10, 2) NULL,
 CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payment]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payment](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[orderID] [int] NULL,
	[paymentDate] [smalldatetime] NULL,
	[Amount] [decimal](10, 2) NULL,
	[phone] [char](10) NULL,
	[paymentMethod] [nvarchar](50) NULL,
	[status] [nvarchar](50) NULL,
 CONSTRAINT [PK_Payment] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](250) NULL,
	[description] [nvarchar](255) NULL,
	[price] [decimal](10, 2) NULL,
	[categoryID] [int] NULL,
	[image] [nvarchar](max) NULL,
	[status] [bit] NULL,
 CONSTRAINT [PK_Products] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tables]    Script Date: 5/23/2024 6:52:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tables](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tablenumber] [int] NULL,
	[status] [nvarchar](50) NULL,
 CONSTRAINT [PK_Tables] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Categories] ON 

INSERT [dbo].[Categories] ([categoryID], [categoryDescription], [name]) VALUES (1, N'Bánh tráng', N'Bánh tráng')
INSERT [dbo].[Categories] ([categoryID], [categoryDescription], [name]) VALUES (2, N'Topping', N'Topping')
INSERT [dbo].[Categories] ([categoryID], [categoryDescription], [name]) VALUES (3, N'Buffet', N'Buffet')
SET IDENTITY_INSERT [dbo].[Categories] OFF
GO
SET IDENTITY_INSERT [dbo].[Customers] ON 

INSERT [dbo].[Customers] ([id], [name], [phone], [point]) VALUES (1, N'MinhHoi', N'3         ', CAST(0.00 AS Decimal(10, 2)))
INSERT [dbo].[Customers] ([id], [name], [phone], [point]) VALUES (2, N'MinhHoi', N'0935998212', CAST(55500.00 AS Decimal(10, 2)))
SET IDENTITY_INSERT [dbo].[Customers] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderDetails] ON 

INSERT [dbo].[OrderDetails] ([id], [orderID], [productID], [quantity], [status], [orderTime]) VALUES (1, 1, 6, 3, N'Done', CAST(N'2024-05-23T11:07:00' AS SmallDateTime))
INSERT [dbo].[OrderDetails] ([id], [orderID], [productID], [quantity], [status], [orderTime]) VALUES (2, 1, 7, 3, N'Done', CAST(N'2024-05-23T11:08:00' AS SmallDateTime))
INSERT [dbo].[OrderDetails] ([id], [orderID], [productID], [quantity], [status], [orderTime]) VALUES (3, 1, 1, 6, N'Done', CAST(N'2024-05-23T11:08:00' AS SmallDateTime))
SET IDENTITY_INSERT [dbo].[OrderDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[Orders] ON 

INSERT [dbo].[Orders] ([id], [tablenumber], [mode], [numberguest], [orderdate], [status], [Total]) VALUES (1, 3, N'buffet', 3, CAST(N'2024-05-23T11:03:00' AS SmallDateTime), N'Done', CAST(555000.00 AS Decimal(10, 2)))
SET IDENTITY_INSERT [dbo].[Orders] OFF
GO
SET IDENTITY_INSERT [dbo].[Payment] ON 

INSERT [dbo].[Payment] ([id], [orderID], [paymentDate], [Amount], [phone], [paymentMethod], [status]) VALUES (9, 1, CAST(N'2024-05-23T00:00:00' AS SmallDateTime), CAST(555000.00 AS Decimal(10, 2)), N'0935998212', N'Momo', N'1')
SET IDENTITY_INSERT [dbo].[Payment] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([id], [name], [description], [price], [categoryID], [image], [status]) VALUES (1, N'Bánh tráng trộn', N'ngon vcl', CAST(30000.00 AS Decimal(10, 2)), 1, N'khong co', 1)
INSERT [dbo].[Products] ([id], [name], [description], [price], [categoryID], [image], [status]) VALUES (2, N'Tóp mỡ', N'dở vc', CAST(5000.00 AS Decimal(10, 2)), 2, N'khong co', 1)
INSERT [dbo].[Products] ([id], [name], [description], [price], [categoryID], [image], [status]) VALUES (6, N'Buffet ticket', N'ngon ', CAST(70000.00 AS Decimal(10, 2)), 3, N'khong co', 1)
INSERT [dbo].[Products] ([id], [name], [description], [price], [categoryID], [image], [status]) VALUES (7, N'Bánh tráng nướng', N'đã ', CAST(25000.00 AS Decimal(10, 2)), 1, N'khong co', 1)
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Tables] ON 

INSERT [dbo].[Tables] ([id], [tablenumber], [status]) VALUES (1, 1, N'1')
INSERT [dbo].[Tables] ([id], [tablenumber], [status]) VALUES (2, 2, N'1')
INSERT [dbo].[Tables] ([id], [tablenumber], [status]) VALUES (3, 3, N'0')
INSERT [dbo].[Tables] ([id], [tablenumber], [status]) VALUES (4, 4, N'0')
SET IDENTITY_INSERT [dbo].[Tables] OFF
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrderDetails_Orders] FOREIGN KEY([orderID])
REFERENCES [dbo].[Orders] ([id])
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_OrderDetails_Orders]
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrderDetails_Products] FOREIGN KEY([productID])
REFERENCES [dbo].[Products] ([id])
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_OrderDetails_Products]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_Orders_Tables] FOREIGN KEY([tablenumber])
REFERENCES [dbo].[Tables] ([id])
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_Orders_Tables]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_Orders] FOREIGN KEY([orderID])
REFERENCES [dbo].[Orders] ([id])
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_Orders]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Categories] FOREIGN KEY([categoryID])
REFERENCES [dbo].[Categories] ([categoryID])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Categories]
GO
USE [master]
GO
ALTER DATABASE [Themgico] SET  READ_WRITE 
GO
