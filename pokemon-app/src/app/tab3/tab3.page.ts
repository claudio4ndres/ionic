import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonButton, IonList, IonItem, IonAvatar, IonLabel, IonSpinner, IonAlert, IonIcon } from '@ionic/angular/standalone';
import { PokemonService, Pokemon } from '../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonButton, IonList, IonItem, IonAvatar, IonLabel, IonSpinner, IonAlert, IonIcon, CommonModule, FormsModule],
})
export class Tab3Page {
  searchTerm = '';
  searchResults: Pokemon[] = [];
  isSearching = false;
  hasSearched = false;
  showAlert = false;
  alertMessage = '';

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  async searchPokemon() {
    if (!this.searchTerm.trim()) {
      this.showAlertMessage('Por favor, ingresa el nombre de un Pokémon');
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;
    this.searchResults = [];

    try {
      const pokemon = await this.pokemonService.searchPokemon(this.searchTerm.trim()).toPromise();
      if (pokemon) {
        this.searchResults = [pokemon];
      }
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      this.showAlertMessage(`No se encontró el Pokémon "${this.searchTerm}". Verifica el nombre e intenta nuevamente.`);
    } finally {
      this.isSearching = false;
    }
  }

  onSearchKeyPress(event: any) {
    if (event.key === 'Enter') {
      this.searchPokemon();
    }
  }

  viewPokemonDetails(pokemon: Pokemon) {
    this.router.navigate(['/tabs/tab2', pokemon.id]);
  }

  getPokemonImage(pokemon: Pokemon): string {
    return pokemon.sprites?.other?.['official-artwork']?.front_default || 
           pokemon.sprites?.front_default || 
           'assets/pokemon-placeholder.png';
  }

  getPokemonTypes(pokemon: Pokemon): string {
    return pokemon.types?.map(type => type.type.name).join(', ') || 'Unknown';
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
    this.hasSearched = false;
  }

  showAlertMessage(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

  closeAlert() {
    this.showAlert = false;
    this.alertMessage = '';
  }
}
