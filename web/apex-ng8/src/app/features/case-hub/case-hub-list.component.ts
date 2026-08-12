import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaseHubService } from './case-hub.service';
import { ApiError } from '../../core/api.service';
import { LOB_OPTIONS, PagedResult, Submission } from '../../core/models';

declare const agGrid: any;

@Component({
  selector: 'apex-case-hub-list',
  templateUrl: './case-hub-list.component.html',
  styleUrls: ['./case-hub-list.component.css']
})
export class CaseHubListComponent implements OnInit, OnDestroy {

  loading = true;
  error: string | null = null;
  result: PagedResult<Submission> | null = null;
  filteredCount = 0;
  pageSize = 25;

  filters = {
    status: '',
    lineOfBusiness: '',
    search: ''
  };

  statusOptions = ['Received', 'Triaged', 'Quoted', 'Referred', 'Bound', 'Declined', 'NotTakenUp'];
  lobOptions = LOB_OPTIONS;

  private gridApi: any = null;

  constructor(private caseHubService: CaseHubService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroyGrid();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.destroyGrid();
    this.caseHubService.listSubmissions({
      status: this.filters.status || undefined,
      lineOfBusiness: this.filters.lineOfBusiness || undefined,
      search: this.filters.search || undefined,
      page: 1,
      pageSize: 200
    }).subscribe(
      (result: PagedResult<Submission>) => {
        this.result = result;
        this.filteredCount = (result && result.items && result.items.length) || 0;
        this.loading = false;
        setTimeout(() => this.ensureGrid(), 0);
      },
      (err: ApiError) => {
        this.error = err.message;
        this.result = null;
        this.filteredCount = 0;
        this.loading = false;
      }
    );
  }

  get submissions(): Submission[] {
    return (this.result && this.result.items) || [];
  }

  get totalCount(): number {
    return (this.result && this.result.totalCount) || 0;
  }

  clearFilters(): void {
    this.filters = { status: '', lineOfBusiness: '', search: '' };
    this.load();
  }

  clearColumnFilters(): void {
    if (this.gridApi) {
      this.gridApi.setFilterModel(null);
      this.updateFilteredCount();
    }
  }

  openCase(submission: Submission): void {
    this.router.navigate(['/case-hub', submission.id]);
  }

  private updateFilteredCount(): void {
    if (!this.gridApi) {
      this.filteredCount = this.submissions.length;
      return;
    }
    let count = 0;
    this.gridApi.forEachNodeAfterFilter(() => { count += 1; });
    this.filteredCount = count;
  }

  private textFilter(): any {
    return {
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: [
          'contains', 'notContains', 'equals', 'notEqual',
          'startsWith', 'endsWith', 'blank', 'notBlank'
        ],
        defaultOption: 'contains',
        buttons: ['apply', 'reset'],
        closeOnApply: true
      }
    };
  }

  private dateFilter(): any {
    return {
      filter: 'agDateColumnFilter',
      filterParams: {
        filterOptions: [
          'equals', 'notEqual', 'lessThan', 'greaterThan',
          'inRange', 'blank', 'notBlank'
        ],
        defaultOption: 'equals',
        buttons: ['apply', 'reset'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          if (!cellValue) { return -1; }
          const cell = new Date(cellValue);
          cell.setHours(0, 0, 0, 0);
          if (cell.getTime() === filterLocalDateAtMidnight.getTime()) { return 0; }
          return cell < filterLocalDateAtMidnight ? -1 : 1;
        }
      }
    };
  }

  private dateFormatter(params: any): string {
    if (!params.value) { return '—'; }
    const d = new Date(params.value);
    if (isNaN(d.getTime())) { return '—'; }
    const dd = ('0' + d.getDate()).slice(-2);
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    return dd + '/' + mm + '/' + d.getFullYear();
  }

  private buildColumnDefs(): any[] {
    return [
      Object.assign({
        colId: 'submissionNumber', headerName: 'Submission #', field: 'submissionNumber',
        width: 140, cellClass: 'apex-table__link'
      }, this.textFilter()),
      Object.assign({
        colId: 'insuredName', headerName: 'Insured', field: 'insuredName',
        minWidth: 160, flex: 1
      }, this.textFilter()),
      Object.assign({
        colId: 'brokerName', headerName: 'Broker', field: 'brokerName', width: 150
      }, this.textFilter()),
      Object.assign({
        colId: 'lineOfBusiness', headerName: 'LOB', field: 'lineOfBusiness', width: 130
      }, this.textFilter()),
      Object.assign({
        colId: 'status', headerName: 'Status', field: 'status', width: 120
      }, this.textFilter()),
      Object.assign({
        colId: 'underwriterName', headerName: 'Underwriter', field: 'underwriterName',
        width: 140,
        valueGetter: (p: any) => (p.data && p.data.underwriterName) || 'Unassigned'
      }, this.textFilter()),
      Object.assign({
        colId: 'receivedDate', headerName: 'Received', field: 'receivedDate',
        width: 120, valueFormatter: (p: any) => this.dateFormatter(p)
      }, this.dateFilter()),
      Object.assign({
        colId: 'dueDate', headerName: 'Due', field: 'dueDate',
        width: 120, valueFormatter: (p: any) => this.dateFormatter(p)
      }, this.dateFilter())
    ];
  }

  private ensureGrid(): void {
    const el = document.getElementById('apex-uwf-list-grid');
    if (!el || typeof agGrid === 'undefined') { return; }
    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.submissions);
      this.updateFilteredCount();
      return;
    }

    const options = {
      columnDefs: this.buildColumnDefs(),
      rowData: this.submissions,
      defaultColDef: {
        sortable: true,
        resizable: true,
        floatingFilter: true,
        filter: true
      },
      animateRows: true,
      rowSelection: 'single',
      suppressCellFocus: true,
      pagination: true,
      paginationPageSize: this.pageSize || 25,
      paginationPageSizeSelector: [10, 25, 50, 100],
      popupParent: document.body,
      onGridReady: (e: any) => {
        this.gridApi = e.api;
        this.updateFilteredCount();
      },
      onFilterChanged: () => this.updateFilteredCount(),
      onPaginationChanged: () => {
        if (this.gridApi) {
          this.pageSize = this.gridApi.paginationGetPageSize();
        }
      },
      onRowClicked: (e: any) => {
        if (e && e.data) {
          this.openCase(e.data);
        }
      }
    };

    if (typeof agGrid.createGrid === 'function') {
      this.gridApi = agGrid.createGrid(el, options);
    } else {
      new agGrid.Grid(el, options);
    }
  }

  private destroyGrid(): void {
    if (this.gridApi && typeof this.gridApi.destroy === 'function') {
      this.gridApi.destroy();
    }
    this.gridApi = null;
  }
}
