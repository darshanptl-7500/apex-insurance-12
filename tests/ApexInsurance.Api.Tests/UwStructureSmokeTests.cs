using System;
using System.Linq;
using System.Reflection;
using ApexInsurance.Data.OpenBox;
using ApexInsurance.Services.Pipeline;
using ApexInsurance.Services.Support;
using ApexInsurance.Services.Workbench;
using ApexInsurance.UI.ViewModels;
using Xunit;

namespace ApexInsurance.Api.Tests
{
    public class UwStructureSmokeTests
    {
        [Fact]
        public void ApiAssembly_ExposesPipelineAndSupportControllers()
        {
            var asm = typeof(ApexInsurance.Api.Controllers.PipelineController).Assembly;
            var names = asm.GetTypes().Select(t => t.Name).ToHashSet(StringComparer.Ordinal);
            Assert.Contains("PipelineController", names);
            Assert.Contains("UnderwriterFileController", names);
            Assert.Contains("SupportController", names);
        }

        [Fact]
        public void Contracts_ExposeWorkbenchInterfaces()
        {
            Assert.True(typeof(IPipelineService).IsInterface);
            Assert.True(typeof(IUnderwriterFileService).IsInterface);
            Assert.True(typeof(ISupportHealthService).IsInterface);
            Assert.True(typeof(IOpenBoxGateway).IsInterface);
        }

        [Fact]
        public void Ui_ViewModels_AreAvailable()
        {
            var vm = new PipelineWorkbenchViewModel
            {
                ActiveBucket = "upcoming",
                Page = 1,
                PageSize = 50
            };
            Assert.Equal("upcoming", vm.ActiveBucket);
            Assert.NotNull(typeof(UnderwriterFileViewModel));
            Assert.NotNull(typeof(SupportHealthViewModel));
        }

        [Fact]
        public void OpenBox_LocalGateway_ImplementsContract()
        {
            Assert.True(typeof(IOpenBoxGateway).IsAssignableFrom(typeof(LocalOpenBoxGateway)));
        }
    }
}
